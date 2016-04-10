var _ = require("underscore");
var fs = require("fs");
var gulp = require("gulp");
var gutil = require("gulp-util");
var del = require("del");
var handlebars = require("gulp-compile-handlebars");
var handlebarsLayout = require("handlebars-layouts")(require("handlebars"));
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var atImport = require("postcss-import");
var assetsRebase = require("postcss-assets-rebase");
var cssnano = require("gulp-cssnano");
var sourcemaps = require("gulp-sourcemaps");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

var NODE_ENV = (process.env.NODE_ENV || '').trim().toLowerCase();

gulp.task("clean", function () {
  return del(["build", "index.html", "misc", "ref"]);
});

gulp.task("handlebars", function () {
  return gulp.src("src/templates/**/*.handlebars")
    .pipe(handlebars({}, {
      batch: ["src/partials"],
      helpers: handlebarsLayout
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest("."));
});

gulp.task("postcss", function () {
  var stream = gulp.src("css/main.css");

  if (NODE_ENV != "production") {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(postcss([
    atImport(),
    assetsRebase({assetsPath: "build", keepStructure: false})
  ]));

  if (NODE_ENV == "production") {
    stream = stream.pipe(cssnano());
  }

  stream = stream.pipe(rename({
      basename: "bundle"
  }));

  if (NODE_ENV != "production") {
    stream = stream.pipe(sourcemaps.write("."));
  }

  return stream.pipe(gulp.dest("build"))
});

gulp.task("webpack", function (done) {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    done();
  })
});

gulp.task("dev", ["clean", "handlebars", "postcss"], function (done) {
  gulp.watch("src/**/*.handlebars", ["handlebars"])
    .on("change", function (event) {
      gutil.log(event.path, "was changed");
    });

  gulp.watch("css/**/*.css", ["postcss"])
    .on("change", function (event) {
      gutil.log(event.path, "was changed");
    });

  var compiler = webpack(webpackConfig);
  compiler.watch(null, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
  });

  done();
});

gulp.task("default", ["clean", "handlebars", "postcss", "webpack"]);
