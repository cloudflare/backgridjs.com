var path = require("path");
var webpack = require("webpack");

var NODE_ENV = (process.env.NODE_ENV || '').trim().toLowerCase();

module.exports = {

  debug: NODE_ENV != "production",

  devtool: NODE_ENV != "production" ? "eval-source-map" : undefined,

  entry: ["./js/main.js"],

  module: {
    loaders: [{
      test: require.resolve("jquery"),
      loader: "expose?$!expose?jQuery"
    }, {
      test: require.resolve("underscore"),
      loader: "expose?_"
    }, {
      test: require.resolve("backbone"),
      loader: "expose?Backbone"
    }, {
      test: require.resolve("backgrid"),
      loader: "expose?Backgrid"
    }, {
      test: require.resolve("moment"),
      loader: "expose?moment"
    }]
  },

  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
    publicPath: __dirname,
    pathinfo: NODE_ENV != "production"
  },

  plugins: NODE_ENV == "production" ? [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": NODE_ENV
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ] : []

}
