(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{119:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return u}));var i=n(0),a=n.n(i);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),p=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=p(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,o=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=p(n),b=i,u=d["".concat(o,".").concat(b)]||d[b]||m[b]||r;return n?a.a.createElement(u,c(c({ref:t},s),{},{components:n})):a.a.createElement(u,c({ref:t},s))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:i,o[1]=c;for(var s=2;s<r;s++)o[s]=n[s];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},85:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return d}));var i=n(3),a=n(7),r=(n(0),n(119)),o=["components"],c={id:"command-line",title:"Synth CLI"},l={unversionedId:"getting_started/command-line",id:"getting_started/command-line",isDocsHomePage:!1,title:"Synth CLI",description:"The Synth CLI (synth) is a Unix-y command line tool wrapped around the core synthetic data engine.",source:"@site/docs/getting_started/cli.md",slug:"/getting_started/command-line",permalink:"/synth/getting_started/command-line",editUrl:"https://github.com/getsynth/synth/edit/master/docs/docs/getting_started/cli.md",version:"current",sidebar:"docsSidebar",previous:{title:"Schema",permalink:"/synth/getting_started/schema"},next:{title:"How it works",permalink:"/synth/getting_started/how-it-works"}},s=[{value:"Usage",id:"usage",children:[{value:"Command: init",id:"command-init",children:[]},{value:"Command: import",id:"command-import",children:[]},{value:"Command: generate",id:"command-generate",children:[]},{value:"Command: serve",id:"command-serve",children:[]}]}],p={toc:s};function d(e){var t=e.components,n=Object(a.a)(e,o);return Object(r.b)("wrapper",Object(i.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"The Synth CLI (",Object(r.b)("inlineCode",{parentName:"p"},"synth"),") is a Unix-y command line tool wrapped around the core synthetic data engine. "),Object(r.b)("h2",{id:"usage"},"Usage"),Object(r.b)("hr",null),Object(r.b)("h3",{id:"command-init"},"Command: init"),Object(r.b)("p",null,"Usage: ",Object(r.b)("inlineCode",{parentName:"p"},"synth init")),Object(r.b)("p",null,"This is the first command that should be run for any new or existing when starting out with Synth.\nThis initialises the workspace and  sets up all the local data necessary to run Synth.\nA ",Object(r.b)("inlineCode",{parentName:"p"},".synth/")," subdirectory is created that is typically not committed to version control."),Object(r.b)("p",null,"This command is always safe to run multiple times though subsequent runs\nmay give errors. This command will never erase your workspace."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"command-import"},"Command: import"),Object(r.b)("p",null,"Usage: ",Object(r.b)("inlineCode",{parentName:"p"},"synth import [OPTIONS] <namespace>")),Object(r.b)("p",null,"Synth can create namespaces from different data sources using the ",Object(r.b)("inlineCode",{parentName:"p"},"synth import")," command.\nAccidentally running ",Object(r.b)("inlineCode",{parentName:"p"},"synth import")," on an existing namespace is safe - the operation will fail."),Object(r.b)("p",null,"If a subdirectory for a given namespace does not exist in your workspace, Synth will create it."),Object(r.b)("h4",{id:"options"},"Options"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("p",{parentName:"li"},Object(r.b)("inlineCode",{parentName:"p"},"--from <from>")," - The location from which to import. Synth supports multiple import strategies. "),Object(r.b)("p",{parentName:"li"},"Importing from a file: Currently we support importing from JSON files by specifying the path to\nthe file: ",Object(r.b)("inlineCode",{parentName:"p"},"/some/path/to/file.json"),"."),Object(r.b)("p",{parentName:"li"},"Importing from standard input: Not specifying ",Object(r.b)("inlineCode",{parentName:"p"},"from")," will accept JSON files from stdin."),Object(r.b)("p",{parentName:"li"},"Importing from a database (e.g. postgres): synth import tpch --from postgres://user:pass@localhost:5432/tpch"))),Object(r.b)("hr",null),Object(r.b)("h3",{id:"command-generate"},"Command: generate"),Object(r.b)("p",null,"Usage: ",Object(r.b)("inlineCode",{parentName:"p"},"synth generate [OPTIONS] <namespace>")),Object(r.b)("p",null,"The ",Object(r.b)("inlineCode",{parentName:"p"},"synth generate")," command will generate data for a given namespace. This will not mutate anything in the underlying configuration."),Object(r.b)("p",null,"If there is a misconfiguration in your schema (for example referring to a field that does not exist), ",Object(r.b)("inlineCode",{parentName:"p"},"synth generate")," will exit with a non-zero exit code and hopefully some error message helping you understand which part of the schema is misconfigured."),Object(r.b)("h4",{id:"options-1"},"Options"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"--collection <collection>")," - Specify a specific collection in a namespace if you don't want to generate data from all collections.  "),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"--size <size>")," - The number of elements which should be generated per collection. This number is not guaranteed, it serves as a lower bound."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"--to <uri>")," - The generation destination. If unspecified, generation defaults to stdout."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"--seed <seed>")," - An unsigned 64 bit integer seed to be used as a seed for generation. Defaults to 0 if unspecified."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"--random")," - A flag which toggles generation with a random seed. This cannot be used with --seed.")),Object(r.b)("hr",null),Object(r.b)("h3",{id:"command-serve"},"Command: serve"),Object(r.b)("p",null,"Usage: ",Object(r.b)("inlineCode",{parentName:"p"},"synth serve [OPTIONS]")),Object(r.b)("p",null,"Run Synth in Daemon mode. The Daemon exposes an HTTP RESTful API on port ",Object(r.b)("inlineCode",{parentName:"p"},"8182")," and creates an internal state which is managed by a version controlled index."),Object(r.b)("p",null,"Daemon mode is used when ",Object(r.b)("inlineCode",{parentName:"p"},"synth")," is used in the context of a collaborating team and comes with a very handy ",Object(r.b)("a",{parentName:"p",href:"https://getsynth.github.io/synthpy/"},"Python client")),Object(r.b)("h4",{id:"options-2"},"Options"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"-b, --bind <bind> [default: 0.0.0.0:8182]")," - The endpoint on which the HTTP server should be exposed.  "),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"-d, --data-directory <data-directory> [default: <workspace>/.synth/]")," - The directory which should host the index. (Default is fine in the context of a workspace)")))}d.isMDXComponent=!0}}]);