/*
  backgrid-select2-cell
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (root, factory) {

  // CommonJS
  if (typeof exports == "object") {
    require("select2");
    module.exports = factory(root,
                             require("underscore"),
                             require("backgrid"));
  }
  // Browser
  else factory(root, root._, root.Backgrid);

}(this, function (root, _, Backgrid)  {

  "use strict";

  /**
     Select2CellEditor is a cell editor that renders a `select2` select box
     instead of the default `<select>` HTML element.

     See:

       - [Select2](http://ivaynberg.github.com/select2/)

     @class Backgrid.Extension.Select2CellEditor
     @extends Backgrid.SelectCellEditor
   */
  var Select2CellEditor = Backgrid.Extension.Select2CellEditor = Backgrid.SelectCellEditor.extend({

    /** @property */
    events: {
      "change": "save"
    },

    /** @property */
    select2Options: {
      openOnEnter: false
    },

    initialize: function () {
      Backgrid.SelectCellEditor.prototype.initialize.apply(this, arguments);
      this.close = _.bind(this.close, this);
    },

    /**
       Sets the options for `select2`. Called by the parent Select2Cell during
       edit mode.
     */
    setSelect2Options: function (options) {
      this.select2Options = _.extend(options || {});
    },

    /**
       Renders a `select2` select box instead of the default `<select>` HTML
       element using the supplied options from #select2Options.

       @chainable
     */
    render: function () {
      Backgrid.SelectCellEditor.prototype.render.apply(this, arguments);
      this.$el.select2(this.select2Options);
      return this;
    },

    /**
       Attach event handlers to the select2 box and focus it.
    */
    postRender: function () {
      var self = this;
      if (self.multiple) self.$el.select2("container").keydown(self.close);
      else self.$el.data("select2").focusser.keydown(self.close);

      self.$el.on("select2-blur", function (e) {
        if (!self.multiple) {
          e.type = "blur";
          self.close(e);
        }
        else {
          // HACK to get around https://github.com/ivaynberg/select2/issues/2011
          // select2-blur is triggered from blur and is fired repeatibly under
          // multiple select. Since blue is fired before everything, but focus
          // is set in focus and click, we need to wait for a while so other
          // event handlers may have a chance to run.
          var id = root.setTimeout(function () {
            root.clearTimeout(id);
            if (!self.$el.select2("isFocused")) {
              e.type = "blur";
              self.close(e);
            }
          }, 200);
        }
      }).select2("focus");
    },

    remove: function () {
      this.$el.select2("destroy");
      return Backgrid.SelectCellEditor.prototype.remove.apply(this, arguments);
    }

  });

  /**
     Select2Cell is a cell class that renders a `select2` select box during edit
     mode.

     @class Backgrid.Extension.Select2Cell
     @extends Backgrid.SelectCell
   */
  Backgrid.Extension.Select2Cell = Backgrid.SelectCell.extend({

    /** @property */
    className: "select2-cell",

    /** @property */
    editor: Select2CellEditor,

    /** @property */
    select2Options: null,

    /**
       Initializer.

       @param {Object} options
       @param {Backbone.Model} options.model
       @param {Backgrid.Column} options.column
       @param {Object} [options.select2Options]

       @throws {TypeError} If `optionsValues` is undefined.
     */
    initialize: function (options) {
      Backgrid.SelectCell.prototype.initialize.apply(this, arguments);
      this.select2Options = options.select2Options || this.select2Options;
      this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
        if (column.get("name") == this.column.get("name")) {
          editor.setSelect2Options(this.select2Options);
        }
      });
    }

  });

}));
