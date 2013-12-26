var $ = require("jquery");
require("codemirror");

function unpad (str) {
  var lines = str.split("\n");
  var spaceCounts = [];
  var pat = /^\s+/;
  for (var i = 0, l = lines.length; i < l; i++) {
    var result = pat.exec(lines[i]);
    if (result == null) spaceCounts.push(0);
    else spaceCounts.push(result[0].length);
  }
  var longestCommonSpaceCount = Math.min.apply(this, spaceCounts.filter(function (c) { return c > 0; }));
  for (var i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].slice(longestCommonSpaceCount);
  }
  return lines.join("\n");
}

module.exports = {

  setUpCodeMirror: function () {

    $("textarea.code-snippet").each(function (index, elm) {
      var $elm = $(elm);

      var cm = window.CodeMirror.fromTextArea(elm, {
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
          eval.call(window, value);
          cm.on("change", function () {
            eval.call(window, cm.doc.getValue());
          });
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
};
