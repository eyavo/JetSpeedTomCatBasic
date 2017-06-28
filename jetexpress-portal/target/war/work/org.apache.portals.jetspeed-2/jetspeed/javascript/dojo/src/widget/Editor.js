
dojo.provide("dojo.widget.Editor");
dojo.deprecated("dojo.widget.Editor", "is replaced by dojo.widget.Editor2", "0.5");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Toolbar");
dojo.require("dojo.widget.RichText");
dojo.require("dojo.widget.ColorPalette");
dojo.require("dojo.string.extras");
dojo.widget.tags.addParseTreeHandler("dojo:Editor");
dojo.widget.Editor = function() {dojo.widget.HtmlWidget.call(this);
this.contentFilters = [];
this._toolbars = [];
dojo.inherits(dojo.widget.Editor, dojo.widget.HtmlWidget);
dojo.widget.Editor.itemGroups = {textGroup: ["bold", "italic", "underline", "strikethrough"],
blockGroup: ["formatBlock", "fontName", "fontSize"],
justifyGroup: ["justifyleft", "justifycenter", "justifyright"],
commandGroup: ["save", "cancel"],
colorGroup: ["forecolor", "hilitecolor"],
listGroup: ["insertorderedlist", "insertunorderedlist"],
indentGroup: ["outdent", "indent"],
linkGroup: ["createlink", "insertimage", "inserthorizontalrule"]
dojo.widget.Editor.formatBlockValues = {"Normal": "p",
"Main heading": "h2",
"Sub heading": "h3",
"Sub sub heading": "h4",
"Preformatted": "pre"
dojo.widget.Editor.fontNameValues = {"Arial": "Arial, Helvetica, sans-serif",
"Verdana": "Verdana, sans-serif",
"Times New Roman": "Times New Roman, serif",
"Courier": "Courier New, monospace"
dojo.widget.Editor.fontSizeValues = {"1 (8 pt)" : "1",
"2 (10 pt)": "2",
"3 (12 pt)": "3",
"4 (14 pt)": "4",
"5 (18 pt)": "5",
"6 (24 pt)": "6",
"7 (36 pt)": "7"
dojo.widget.Editor.defaultItems = [
"commandGroup", "|", "blockGroup", "|", "textGroup", "|", "colorGroup", "|", "justifyGroup", "|", "listGroup", "indentGroup", "|", "linkGroup"
];
dojo.widget.Editor.supportedCommands = ["save", "cancel", "|", "-", "/", " "];
dojo.lang.extend(dojo.widget.Editor, {widgetType: "Editor",
saveUrl: "",
saveMethod: "post",
saveArgName: "editorContent",
closeOnSave: false,
items: dojo.widget.Editor.defaultItems,
formatBlockItems: dojo.lang.shallowCopy(dojo.widget.Editor.formatBlockValues),
fontNameItems: dojo.lang.shallowCopy(dojo.widget.Editor.fontNameValues),
fontSizeItems: dojo.lang.shallowCopy(dojo.widget.Editor.fontSizeValues),
getItemProperties: function(name) {var props = {};
switch(name.toLowerCase()) {case "bold":
case "italic":
case "underline":
case "strikethrough":
props.toggleItem = true;
break;
case "justifygroup":
props.defaultButton = "justifyleft";
props.preventDeselect = true;
props.buttonGroup = true;
break;
case "listgroup":
props.buttonGroup = true;
break;
case "save":
case "cancel":
props.label = dojo.string.capitalize(name);
break;
case "forecolor":
case "hilitecolor":
props.name = name;
props.toggleItem = true;
props.icon = this.getCommandImage(name);
break;
case "formatblock":
props.name = "formatBlock";
props.values = this.formatBlockItems;
break;
case "fontname":
props.name = "fontName";
props.values = this.fontNameItems;
case "fontsize":
props.name = "fontSize";
props.values = this.fontSizeItems;
return props;
validateItems: true,
focusOnLoad: true,
minHeight: "1em",
_richText: null,
_richTextType: "RichText",
_toolbarContainer: null,
_toolbarContainerType: "ToolbarContainer",
_toolbars: [],
_toolbarType: "Toolbar",
_toolbarItemType: "ToolbarItem",
buildRendering: function(args, frag) {var node = frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"];
var trt = dojo.widget.createWidget(this._richTextType, {focusOnLoad: this.focusOnLoad,
minHeight: this.minHeight
var _this = this;
setTimeout(function(){_this.setRichText(trt);
_this.initToolbar();
_this.fillInTemplate(args, frag);
setRichText: function(richText) {if(this._richText && this._richText == richText) {dojo.debug("Already set the richText to this richText!");
return;
if(this._richText && !this._richText.isClosed) {dojo.debug("You are switching richTexts yet you haven't closed the current one. Losing reference!");
this._richText = richText;
dojo.event.connect(this._richText, "close", this, "onClose");
dojo.event.connect(this._richText, "onLoad", this, "onLoad");
dojo.event.connect(this._richText, "onDisplayChanged", this, "updateToolbar");
if(this._toolbarContainer) {this._toolbarContainer.enable();
this.updateToolbar(true);
initToolbar: function() {if(this._toolbarContainer) { return; }
this._toolbarContainer = dojo.widget.createWidget(this._toolbarContainerType);
var tb = this.addToolbar();
var last = true;
for(var i = 0; i < this.items.length; i++) {if(this.items[i] == "\n") {tb = this.addToolbar();
this.insertToolbar(this._toolbarContainer.domNode, this._richText.domNode);
insertToolbar: function(tbNode, richTextNode) {dojo.html.insertBefore(tbNode, richTextNode);
addToolbar: function(toolbar) {this.initToolbar();
if(!(toolbar instanceof dojo.widget.Toolbar)) {toolbar = dojo.widget.createWidget(this._toolbarType);
this._toolbarContainer.addChild(toolbar);
this._toolbars.push(toolbar);
return toolbar;
addItem: function(item, tb, dontValidate) {if(!tb) { tb = this._toolbars[0]; }
var cmd = ((item)&&(!dojo.lang.isUndefined(item["getValue"]))) ?  cmd = item["getValue"](): item;
var groups = dojo.widget.Editor.itemGroups;
if(item instanceof dojo.widget.ToolbarItem) {tb.addChild(item);
var worked = true;
if(cmd == "justifyGroup" || cmd == "listGroup") {var btnGroup = [cmd];
for(var i = 0 ; i < group.length; i++) {if(dontValidate || this.isSupportedCommand(group[i])) {btnGroup.push(this.getCommandImage(group[i]));
if(btnGroup.length){var btn = tb.addChild(btnGroup, null, this.getItemProperties(cmd));
dojo.event.connect(btn, "onClick", this, "_action");
dojo.event.connect(btn, "onChangeSelect", this, "_action");
return worked;
return worked;
if(dontValidate || this.isSupportedCommand(cmd)) {cmd = cmd.toLowerCase();
if(cmd == "formatblock") {var select = dojo.widget.createWidget("ToolbarSelect", {name: "formatBlock",
values: this.formatBlockItems
tb.addChild(select);
var _this = this;
dojo.event.connect(select, "onSetValue", function(item, value) {_this.onAction("formatBlock", value);
values: this.fontNameItems
tb.addChild(select);
dojo.event.connect(select, "onSetValue", dojo.lang.hitch(this, function(item, value) {this.onAction("fontName", value);
values: this.fontSizeItems
tb.addChild(select);
dojo.event.connect(select, "onSetValue", dojo.lang.hitch(this, function(item, value) {this.onAction("fontSize", value);
dojo.event.connect(btn, "onSetValue", this, "_setValue");
if(cmd == "save"){dojo.event.connect(btn, "onClick", this, "_save");
dojo.event.connect(btn, "onChangeSelect", this, "_action");
return true;
enableToolbar: function() {if(this._toolbarContainer) {this._toolbarContainer.domNode.style.display = "";
this._toolbarContainer.enable();
disableToolbar: function(hide){if(hide){if(this._toolbarContainer){this._toolbarContainer.domNode.style.display = "none";
_updateToolbarLastRan: null,
_updateToolbarTimer: null,
_updateToolbarFrequency: 500,
updateToolbar: function(force) {if(!this._toolbarContainer) { return; }
var diff = new Date() - this._updateToolbarLastRan;
if(!force && this._updateToolbarLastRan && (diff < this._updateToolbarFrequency)) {clearTimeout(this._updateToolbarTimer);
var _this = this;
this._updateToolbarTimer = setTimeout(function() {_this.updateToolbar();
return;
var items = this._toolbarContainer.getItems();
for(var i = 0; i < items.length; i++) {var item = items[i];
if(item instanceof dojo.widget.ToolbarSeparator) { continue; }
var cmd = item._name;
if (cmd == "save" || cmd == "cancel") { continue; }
else if(cmd == "justifyGroup") {try {if(!this._richText.queryCommandEnabled("justifyleft")) {item.disable(false, true);
var jitems = item.getItems();
for(var j = 0; j < jitems.length; j++) {var name = jitems[j]._name;
var value = this._richText.queryCommandValue(name);
if(typeof value == "boolean" && value) {value = name;
break;
if(!value) { value = "justifyleft"; }
item.setValue(value, false, true);
for(var j = 0; j < litems.length; j++) {this.updateItem(litems[j]);
updateItem: function(item) {try {var cmd = item._name;
var enabled = this._richText.queryCommandEnabled(cmd);
item.setEnabled(enabled, false, true);
var active = this._richText.queryCommandState(cmd);
if(active && cmd == "underline") {active = !this._richText.queryCommandEnabled("unlink");
item.setSelected(active, false, true);
return true;
supportedCommands: dojo.widget.Editor.supportedCommands.concat(),
isSupportedCommand: function(cmd) {var yes = dojo.lang.inArray(cmd, this.supportedCommands);
if(!yes) {try {var richText = this._richText || dojo.widget.HtmlRichText.prototype;
yes = richText.queryCommandAvailable(cmd);
return yes;
getCommandImage: function(cmd) {if(cmd == "|") {return cmd;
_action: function(e) {this._fire("onAction", e.getValue());
_setValue: function(a, b) {this._fire("onAction", a.getValue(), b);
_save: function(e){if(!this._richText.isClosed){if(this.saveUrl.length){var content = {};
content[this.saveArgName] = this.getHtml();
dojo.io.bind({method: this.saveMethod,
url: this.saveUrl,
content: content
if(this.closeOnSave){this._richText.close(e.getName().toLowerCase() == "save");
_close: function(e) {if(!this._richText.isClosed) {this._richText.close(e.getName().toLowerCase() == "save");
onAction: function(cmd, value) {switch(cmd) {case "createlink":
if(!(value = prompt("Please enter the URL of the link:", "http://"))) {return;
break;
case "insertimage":
if(!(value = prompt("Please enter the URL of the image:", "http://"))) {return;
break;
this._richText.execCommand(cmd, value);
fillInTemplate: function(args, frag) {},
_fire: function(eventName) {if(dojo.lang.isFunction(this[eventName])) {var args = [];
if(arguments.length == 1) {args.push(this);
this[eventName].apply(this, args);
getHtml: function(){this._richText.contentFilters = this._richText.contentFilters.concat(this.contentFilters);
return this._richText.getEditorContent();
getEditorContent: function(){return this.getHtml();
onClose: function(save, hide){this.disableToolbar(hide);
if(save) {this._fire("onSave");
onLoad: function(){},
onSave: function(){},
onCancel: function(){}});