/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

// jshint globalstrict:true, node:true

"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: {
      options: {
        force: true
      },
      default: [
        "build/*"
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

  });

  grunt.loadNpmTasks("grunt-component-build");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-recess");

  grunt.registerTask("default", ["clean", "componentbuild", "recess", "uglify"]);
};
