use crate::cli::export::{ExportParams, ExportStrategy};
use crate::cli::import::ImportStrategy;
use crate::sampler::{Sampler, SamplerOutput};
use anyhow::Result;
use chrono::{DateTime, Utc};
use mongodb::bson::Bson;
use mongodb::options::FindOptions;
use mongodb::{bson::Document, options::ClientOptions, sync::Client};
use serde_json::Value as JsonValue;
use std::collections::BTreeMap;
use std::convert::TryFrom;
use std::str::FromStr;
use synth_core::graph::prelude::content::number_content::U64;
use synth_core::graph::prelude::number_content::I64;
use synth_core::graph::prelude::{NumberContent, ObjectContent, RangeStep, Number, ChronoValue};
use synth_core::schema::number_content::F64;
use synth_core::schema::{
    ArrayContent, BoolContent, Categorical, ChronoValueType, DateTimeContent, RegexContent,
    StringContent,
};
use synth_core::{Content, Name, Namespace, Value};

#[derive(Clone, Debug)]
pub struct MongoExportStrategy {
    pub uri: String,
}

#[derive(Clone, Debug)]
pub struct MongoImportStrategy {
    pub uri: String,
}

impl ImportStrategy for MongoImportStrategy {
    fn import(self) -> Result<Namespace> {
        let client_options = ClientOptions::parse(&self.uri)?;

        info!("Connecting to database at {} ...", &self.uri);

        let client = Client::with_options(client_options)?;

        let db_name = parse_db_name(&self.uri)?;

        // 0: Initialise empty Namespace
        let mut namespace = Namespace::default();
        let database = client.database(db_name);

        // 1: First pass - create master schema
        for collection_name in database.list_collection_names(None)? {
            let collection = database.collection(&collection_name);

            // This may be useful later
            // let count = collection.estimated_document_count(None)?;

            if let Ok(Some(some_obj)) = collection.find_one(None, None) {
                let as_array = Content::Array(ArrayContent::from_content_default_length(
                    doc_to_content(&some_obj),
                ));
                namespace.put_collection(&Name::from_str(&collection_name)?, as_array)?;
            } else {
                info!("Collection {} is empty. Skipping...", collection_name);
                continue;
            }
        }

        // 2: Run an ingest step with 10 documents
        for collection_name in database.list_collection_names(None)? {
            let collection = database.collection(&collection_name);

            // This may be useful later
            // let count = collection.estimated_document_count(None)?;

            let mut find_options = FindOptions::default();
            find_options.limit = Some(10);

            let mut random_sample: Vec<Document> = collection
                .find(None, find_options)?
                .collect::<Result<Vec<Document>, _>>()?;

            random_sample.iter_mut().for_each(|doc| {
                doc.remove("_id");
            });

            namespace.default_try_update(
                &Name::from_str(&collection_name)?,
                &serde_json::to_value(random_sample)?,
            )?;
        }

        Ok(namespace)
    }

    fn import_collection(self, name: &Name) -> Result<Content> {
        self.import()?
            .collections
            .remove(name)
            .ok_or_else(|| anyhow!("Could not find table '{}' in MongoDb database.", name))
    }

    fn into_value(self) -> Result<JsonValue> {
        unreachable!()
    }
}

fn doc_to_content(doc: &Document) -> Content {
    let mut root = BTreeMap::new();

    // Notice this `filter` here is a hack as we don't support id's out of the box.
    for (name, bson) in doc.iter().filter(|(name, _)| name.as_str() != "_id") {
        let content = bson_to_content(bson);
        root.insert(name.clone(), content);
    }
    Content::Object(ObjectContent {
        fields: root,
        ..Default::default()
    })
}

fn bson_to_content(bson: &Bson) -> Content {
    match bson {
        Bson::Double(d) => Content::Number(NumberContent::F64(F64::Range(RangeStep::new(*d, *d + 1., 0.1)))),
        Bson::String(_) => Content::String(StringContent::default()),
        Bson::Array(array) => {
            let length = Content::Number(NumberContent::U64(U64::Constant(array.len() as u64)));
            let content_iter = array.iter().map(bson_to_content);

            Content::Array(ArrayContent {
                length: Box::new(length),
                content: Box::new(Content::OneOf(content_iter.collect())),
            })
        }
        Bson::Document(doc) => doc_to_content(doc),
        Bson::Boolean(_) => Content::Bool(BoolContent::Categorical(Categorical::default())),
        Bson::Null => Content::null(),
        Bson::RegularExpression(regex) => Content::String(StringContent::Pattern(
            RegexContent::pattern(regex.pattern.clone()).unwrap_or_default(),
        )),
        Bson::JavaScriptCode(_) => {
            Content::String(StringContent::Categorical(Categorical::default()))
        }
        Bson::JavaScriptCodeWithScope(_) => {
            Content::String(StringContent::Categorical(Categorical::default()))
        }
        Bson::Int32(i) => Content::Number(NumberContent::I64(I64::Range(RangeStep::new(*i as i64, *i as i64 + 1, 1)))),
        Bson::Int64(i) => Content::Number(NumberContent::I64(I64::Range(RangeStep::new(*i, *i + 1, 1)))),
        Bson::DateTime(_) => Content::String(StringContent::DateTime(DateTimeContent {
            format: "".to_string(),
            type_: ChronoValueType::DateTime,
            begin: None,
            end: None,
        })),
        // There should be a more explicit enumeration here, but we don't support
        // all the required types here.
        _ => Content::String(StringContent::default()),
    }
}

impl ExportStrategy for MongoExportStrategy {
    fn export(self, params: ExportParams) -> Result<()> {
        let mut client = Client::with_uri_str(&self.uri)?;
        let sampler = Sampler::try_from(&params.namespace)?;
        let output =
            sampler.sample_seeded(params.collection_name.clone(), params.target, params.seed)?;

        match output {
            SamplerOutput::Collection(values) => {
                self.insert_data(params.collection_name.unwrap().to_string(), &values, &mut client)
            }
            SamplerOutput::Namespace(namespace) => {
                for (name, values) in namespace {
                    self.insert_data(name, &values, &mut client)?;
                }
                Ok(())
            }
        }
    }
}

impl MongoExportStrategy {
    fn insert_data(
        &self,
        collection_name: String,
        collection: &[Value],
        client: &mut Client,
    ) -> Result<()> {
        let db_name = parse_db_name(&self.uri)?;

        let mut docs = Vec::new();

        for value in collection {
            docs.push(match value_to_bson(value.clone()) {
                Bson::Document(doc) => doc,
                _ => bail!("invalid bson document"),
            });
        }

        let n_values = docs.len();

        client
            .database(db_name)
            .collection(&collection_name)
            .insert_many(docs, None)?;

        info!(
            "Inserted {} rows into collection {} ...",
            n_values, collection_name
        );

        Ok(())
    }
}

fn value_to_bson(value: Value) -> Bson {
    match value {
        Value::Null(_) => Bson::Null,
        Value::Bool(b) => Bson::Boolean(b),
        Value::Number(n) => number_to_bson(n),
        Value::String(s) => Bson::String(s),
        Value::DateTime(dt) => date_time_to_bson(dt.value), //TODO: format instead?
        Value::Object(obj) => object_to_bson(obj),
        Value::Array(arr) => array_to_bson(arr)
    }
}

fn array_to_bson(array: Vec<Value>) -> Bson {
    Bson::Array(array.into_iter().map(value_to_bson).collect())
}

fn object_to_bson(obj: BTreeMap<String, Value>) -> Bson {
    let obj = obj.into_iter().map(|(name, value)| (name, value_to_bson(value))).collect();
    Bson::Document(obj)
}


fn date_time_to_bson(datetime: ChronoValue) -> Bson {
    Bson::DateTime(mongodb::bson::DateTime::from(match datetime {
        // those are not optimal as BSON doesn't have a way to specify dates or times, just both at once
        ChronoValue::NaiveDate(nd) => DateTime::<Utc>::from_utc(nd.and_hms(0, 0, 0), Utc),
        ChronoValue::NaiveTime(nt) => DateTime::<Utc>::from_utc(chrono::naive::MIN_DATE.and_time(nt), Utc),
        ChronoValue::NaiveDateTime(ndt) => DateTime::<Utc>::from_utc(ndt, Utc),
        ChronoValue::DateTime(dt) => dt.into(),
    }))
}

fn number_to_bson(number: Number) -> Bson {
    match number {
        Number::I8(i8) => Bson::Int32(i8 as i32),
        Number::I16(i16) => Bson::Int32(i16 as i32),
        Number::I32(i32) => Bson::Int32(i32),
        Number::I64(i64) => Bson::Int64(i64),
        Number::I128(i128) => Bson::Int64(i128 as i64),
        Number::U8(u8) => Bson::Int32(u8 as i32),
        Number::U16(u16) => Bson::Int32(u16 as i32),
        Number::U32(u32) => Bson::Int64(u32 as i64),
        Number::U64(u64) => Bson::Int64(u64 as i64),
        Number::U128(u128) => Bson::Int64(u128 as i64),
        Number::F32(f32) => Bson::Double(*f32 as f64),
        Number::F64(f64) => Bson::Double(*f64)
    }
}

fn parse_db_name(uri: &str) -> Result<&str> {
    // this may require a parser instead of `split`
    uri.split('/')
        .last()
        .ok_or_else(|| anyhow!("Cannot export data. No database name specified in the uri"))
}
