/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

// jshint globalstrict:true, node:true

"use strict";

var Handlebars = require("handlebars");
require("handlebars-layouts")(Handlebars);

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: {
      options: {
        force: true
      },
      html: [
        "index.html",
        "ref",
        "misc"
      ],
      build: [
        "build"
      ]
    },

    connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    },

    componentbuild: {
      default: {
        src: ".",
        dest: "build"
      }
    },

    uglify: {
      options: {
        mangle: true,
        compress: true,
        preserveComments: "some"
      },
      default: {
        files: {
          "build/build.min.js": ["build/build.js"]
        }
      }
    },

    recess: {
      default: {
        options: {
          compress: true
        },
        files: {
          "build/build.min.css": ["build/build.css"]
        }
      }
    },

    handlebars: {
      options: {
        partials: {
          "layout": "src/partials/layout.html"
        }
      },
      default: {
        files: [{
          expand: true,
          cwd: "src/templates",
          dest: ".",
          src: "**/*.handlebars",
          ext: ".html"
        }]
      }
    },

    watch: {
      templates: {
        files: ["src/**/*.*"],
        tasks: ["handlebars"]
      },
      components: {
        files: ["components/**/*.*", "css/**/*.*", "js/**/*.*"],
        tasks: ["clean:build", "componentbuild", "recess", "uglify"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-component-build");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-recess");

  grunt.registerTask("default", ["clean", "componentbuild", "recess", "uglify", "handlebars"]);
  grunt.registerMultiTask("handlebars", "Compile Handlerbars templates into HTML files", function () {
    var options = this.options();
    var _ = grunt.util._;

    _.each(options.partials, function(v, k) {
      Handlebars.registerPartial(k, grunt.file.read(v));
    });

    this.files.forEach(function (file) {
      file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else return true;
      }).forEach(function (src) {
        var template = Handlebars.compile(grunt.file.read(src));
        grunt.file.write(file.dest, template({}));
      });
    });
  });
};
