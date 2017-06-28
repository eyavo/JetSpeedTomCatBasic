
dojo.require("dojo.html.common");
dojo.provide("dojo.html.selection");
dojo.require("dojo.dom");
dojo.require("dojo.lang.common");
dojo.html.selectionType = {NONE : 0,
TEXT : 1,
CONTROL : 2
dojo.html.clearSelection = function(){var _window = dojo.global();
var _document = dojo.doc();
try{if(_window["getSelection"]){if(dojo.render.html.safari){_window.getSelection().collapse();
return true;
return false;
dojo.html.disableSelection = function(element){element = dojo.byId(element)||dojo.body();
var h = dojo.render.html;
if(h.mozilla){element.style.MozUserSelect = "none";
return true;
dojo.html.enableSelection = function(element){element = dojo.byId(element)||dojo.body();
var h = dojo.render.html;
if(h.mozilla){element.style.MozUserSelect = "";
return true;
dojo.html.selectElement = function(element){dojo.deprecated("dojo.html.selectElement", "replaced by dojo.html.selection.selectElementChildren", 0.5);
dojo.html.selectInputText = function(element){var _window = dojo.global();
var _document = dojo.doc();
element = dojo.byId(element);
if(_document["selection"] && dojo.body()["createTextRange"]){var range = element.createTextRange();
range.moveStart("character", 0);
range.moveEnd("character", element.value.length);
range.select();
element.setSelectionRange(0, element.value.length);
element.focus();
dojo.html.isSelectionCollapsed = function(){dojo.deprecated("dojo.html.isSelectionCollapsed", "replaced by dojo.html.selection.isCollapsed", 0.5);
return dojo.html.selection.isCollapsed();
dojo.lang.mixin(dojo.html.selection, {getType: function() {if(dojo.doc()["selection"]){return dojo.html.selectionType[dojo.doc().selection.type.toUpperCase()];
var oSel;
try {oSel = dojo.global().getSelection();}
catch (e) {}
if(oSel && oSel.rangeCount==1){var oRange = oSel.getRangeAt(0);
if (oRange.startContainer == oRange.endContainer && (oRange.endOffset - oRange.startOffset) == 1
&& oRange.startContainer.nodeType != dojo.dom.TEXT_NODE) {stype = dojo.html.selectionType.CONTROL;
return stype;
isCollapsed: function() {var _window = dojo.global();
var _document = dojo.doc();
if(_document["selection"]){return _document.selection.createRange().text == "";
if(dojo.lang.isString(selection)){return selection == "";
getSelectedElement: function() {if ( dojo.html.selection.getType() == dojo.html.selectionType.CONTROL ){if(dojo.doc()["selection"]){var range = dojo.doc().selection.createRange();
if ( range && range.item ){return dojo.doc().selection.createRange().item(0);
return selection.anchorNode.childNodes[ selection.anchorOffset ];
getParentElement: function() {if(dojo.html.selection.getType() == dojo.html.selectionType.CONTROL){var p = dojo.html.selection.getSelectedElement();
if(p){ return p.parentNode; }}else{if(dojo.doc()["selection"]){return dojo.doc().selection.createRange().parentElement();
if(selection){var node = selection.anchorNode;
while ( node && node.nodeType != dojo.dom.ELEMENT_NODE ){node = node.parentNode;
return node;
getSelectedText: function(){if(dojo.doc()["selection"]){if(dojo.html.selection.getType() == dojo.html.selectionType.CONTROL){return null;
return dojo.doc().selection.createRange().text;
if(selection){return selection.toString();
getSelectedHtml: function(){if(dojo.doc()["selection"]){if(dojo.html.selection.getType() == dojo.html.selectionType.CONTROL){return null;
return dojo.doc().selection.createRange().htmlText;
if(selection && selection.rangeCount){var frag = selection.getRangeAt(0).cloneContents();
var div = document.createElement("div");
div.appendChild(frag);
return div.innerHTML;
return null;
hasAncestorElement: function(tagName ){return (dojo.html.selection.getAncestorElement.apply(this, arguments) != null);
getAncestorElement: function(tagName ){var node = dojo.html.selection.getSelectedElement() || dojo.html.selection.getParentElement();
while(node ){if(dojo.html.selection.isTag(node, arguments).length>0){return node;
node = node.parentNode;
return null;
isTag: function(node, tags) {if(node && node.tagName) {for (var i=0; i<tags.length; i++){if (node.tagName.toLowerCase()==String(tags[i]).toLowerCase()){return String(tags[i]).toLowerCase();
return "";
selectElement: function(element) {var _window = dojo.global();
var _document = dojo.doc();
element = dojo.byId(element);
if(_document.selection && dojo.body().createTextRange){try{var range = dojo.body().createControlRange();
range.addElement(element);
range.select();
if(selection["removeAllRanges"]){var range = _document.createRange() ;
range.selectNode(element) ;
selection.removeAllRanges() ;
selection.addRange(range) ;
selectElementChildren: function(element){var _window = dojo.global();
var _document = dojo.doc();
element = dojo.byId(element);
if(_document.selection && dojo.body().createTextRange){var range = dojo.body().createTextRange();
range.moveToElementText(element);
range.select();
if(selection["setBaseAndExtent"]){selection.setBaseAndExtent(element, 0, element, element.innerText.length - 1);
getBookmark: function(){var bookmark;
var _document = dojo.doc();
if(_document["selection"]){var range = _document.selection.createRange();
bookmark = range.getBookmark();
try {selection = dojo.global().getSelection();}
catch (e) {}
if(selection){var range = selection.getRangeAt(0);
bookmark = range.cloneRange();
return bookmark;
moveToBookmark: function(bookmark){var _document = dojo.doc();
if(_document["selection"]){var range = _document.selection.createRange();
range.moveToBookmark(bookmark);
range.select();
try {selection = dojo.global().getSelection();}
catch (e) {}
if(selection && selection['removeAllRanges']){selection.removeAllRanges() ;
selection.addRange(bookmark) ;
collapse: function(beginning) {if(dojo.global()['getSelection']){var selection = dojo.global().getSelection();
if(selection.removeAllRanges){if(beginning){selection.collapseToStart();
range.collapse(beginning);
range.select();
remove: function() {if(dojo.doc().selection) {var selection = dojo.doc().selection;
if ( selection.type.toUpperCase() != "NONE" ){selection.clear();
return selection;
for ( var i = 0; i < selection.rangeCount; i++ ){selection.getRangeAt(i).deleteContents();
return selection;