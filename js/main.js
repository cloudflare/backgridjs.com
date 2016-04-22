var $ = require("jquery");
require("bootstrap");
var CodeMirror = require("codemirror");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/css/css");
var _ = require("underscore");
var Backbone = require("backbone");
Backbone.$ = $;
var Backgrid = require("backgrid");
require("backgrid-paginator");
require("backgrid-filter");
require("backgrid-select-all");
require("backgrid-select2-cell");
require("backgrid-moment-cell");
require("backgrid-text-cell");

function unpad (str) {
  var lines = str.split("\n");
  var spaceCounts = [];
  var pat = /^\s+/;
  for (var i = 0, l = lines.length; i < l; i++) {
    var result = pat.exec(lines[i]);
    if (result == null) spaceCounts.push(0);
    else spaceCounts.push(result[0].length);
  }
  var longestCommonSpaceCount = Math.min.apply(this, _.filter(spaceCounts, function (c) { return c > 0; }));
  for (var i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].slice(longestCommonSpaceCount);
  }
  return lines.join("\n");
}

function setUpCodeMirror() {

  $("textarea.code-snippet").each(function (index, elm) {
    var $elm = $(elm);

    var cm = CodeMirror.fromTextArea(elm, {
      mode: $elm.data("mode"),
      lineNumbers: true,
      readOnly: true,
      theme: "eclipse",
      tabindex: -1
    });

    if ($elm.data("mode") === "javascript") {
      var value = $elm.val();
      cm.setValue(unpad(value));
      if ($elm.data("eval") === "yes") {
        if (window.execScript) window.execScript(value);
        else window.eval.call(window, value);
      }
    }
    else {
      var lineCount = cm.doc.lineCount();
      for (var i = 0; i < lineCount; i++) {
        cm.indentLine(i);
      }
    }

    $elm.data("codemirror", cm);
  });
}

$(document).ready(function () {
  setUpCodeMirror();

  $("a[href^='/#'], a[href^='#']").click(function (e) {
    e.preventDefault();
    var target = this.hash;
    if (target) {
      var $target = $(target);
      $("html, body").stop().animate({
        "scrollTop": $target.offset().top - 55
      }, 500, "swing", function() {
        window.location.hash = target;
      });
    }
  });
});
