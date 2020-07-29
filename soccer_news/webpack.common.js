const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const copy = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.join(process.cwd(), "/src/src-sw.js"),
      swDest: "sw.js",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      minify: { collapseWhitespace: true, removeComments: true },
      inject: true,
    }),
    new copy([
      {
        from: "./src/manifest.json",
        to: "manifest.json",
      },
      {
        from: "./src/clipart-ball-logo.png",
        to: "clipart-ball-logo.png",
      },
      {
        from: "./src/assets/components",
        to: "assets/components",
      },
      {
        from: "./src/assets/icons",
        to: "assets/icons",
      },
      {
        from: "./src/assets/img",
        to: "assets/img",
      },
    ]),
  ],
  devtool: "source-map",
};
