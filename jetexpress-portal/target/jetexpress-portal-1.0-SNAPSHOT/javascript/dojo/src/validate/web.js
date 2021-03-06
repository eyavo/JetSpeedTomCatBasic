
dojo.provide("dojo.validate.web");
dojo.require("dojo.validate.common");
dojo.validate.isIpAddress = function(value, flags) {var re = new RegExp("^" + dojo.regexp.ipAddress(flags) + "$", "i");
return re.test(value);}
dojo.validate.isUrl = function(value, flags) {var re = new RegExp("^" + dojo.regexp.url(flags) + "$", "i");
return re.test(value);}
dojo.validate.isEmailAddress = function(value, flags) {var re = new RegExp("^" + dojo.regexp.emailAddress(flags) + "$", "i");
return re.test(value);}
dojo.validate.isEmailAddressList = function(value, flags) {var re = new RegExp("^" + dojo.regexp.emailAddressList(flags) + "$", "i");
return re.test(value);}
dojo.validate.getEmailAddressList = function(value, flags) {if(!flags) { flags = {}; }
if(!flags.listSeparator) { flags.listSeparator = "\\s;,"; }
if ( dojo.validate.isEmailAddressList(value, flags) ) {return value.split(new RegExp("\\s*[" + flags.listSeparator + "]\\s*"));}
return [];}
