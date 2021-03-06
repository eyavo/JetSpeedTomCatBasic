
dojo.provide("dojo.rpc.RpcService");
dojo.require("dojo.io.*");
dojo.require("dojo.json");
dojo.require("dojo.lang.func");
dojo.require("dojo.Deferred");
dojo.rpc.RpcService = function(url){if(url){this.connect(url);}}
dojo.lang.extend(dojo.rpc.RpcService, {strictArgChecks: true,
serviceUrl: "",
parseResults: function(obj){return obj;},
errorCallback: function( deferredRequestHandler){return function(type, e){deferredRequestHandler.errback(new Error(e.message));}},
resultCallback: function( deferredRequestHandler){var tf = dojo.lang.hitch(this,
function(type, obj, e){if (obj["error"]!=null) {var err = new Error(obj.error);
err.id = obj.id;
deferredRequestHandler.errback(err);} else {var results = this.parseResults(obj);
deferredRequestHandler.callback(results);}}
);
return tf;},
generateMethod: function( method,  parameters,  url){return dojo.lang.hitch(this, function(){var deferredRequestHandler = new dojo.Deferred();
if( (this.strictArgChecks) &&
(parameters != null) &&
(arguments.length != parameters.length)
){dojo.raise("Invalid number of parameters for remote method.");} else {this.bind(method, arguments, deferredRequestHandler, url);}
return deferredRequestHandler;});},
processSmd: function( object){dojo.debug("RpcService: Processing returned SMD.");
if(object.methods){dojo.lang.forEach(object.methods, function(m){if(m && m["name"]){dojo.debug("RpcService: Creating Method: this.", m.name, "()");
this[m.name] = this.generateMethod(	m.name,
m.parameters,
m["url"]||m["serviceUrl"]||m["serviceURL"]);
if(dojo.lang.isFunction(this[m.name])){dojo.debug("RpcService: Successfully created", m.name, "()");}else{dojo.debug("RpcService: Failed to create", m.name, "()");}}}, this);}
this.serviceUrl = object.serviceUrl||object.serviceURL;
dojo.debug("RpcService: Dojo RpcService is ready for use.");},
connect: function( smdUrl){dojo.debug("RpcService: Attempting to load SMD document from:", smdUrl);
dojo.io.bind({url: smdUrl,
mimetype: "text/json",
load: dojo.lang.hitch(this, function(type, object, e){ return this.processSmd(object); }),
sync: true});}});
