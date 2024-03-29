/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require("webpack-node-externals");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require('webpack');
const { ProvidePlugin } = require("webpack");

const libsToExcludeFromCompilation = [
  "webpack",
  "webpack-virtual-modules",
  "webpack-node-externals",
  "handlebars",
  "express",
  "ts-loader",
  "fork-ts-checker-webpack-plugin"
]

const config = {
  entry: path.join(__dirname, "src", "cli.ts"),
  target: "node",
  externalsPresets: { node: true },
  externals: [nodeExternals({
    allowlist: (modulePath) => {
      console.log(modulePath);
      return !(libsToExcludeFromCompilation.includes(modulePath));
    }
  })],
  output: {
    filename: "cli.js",
    path: path.join(__dirname, "dist"),
    globalObject: "this",
    library: {
      type: "umd",
    }
  },
  module: {
    rules: [
      {
        test: /.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.(jsx?)|(tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader", "ts-loader"]
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "./dist")],
    }),
    new ProvidePlugin({
      "Handlebars": "handlebars",
    })
  ]
}


// Fix issues with importing unsupported fsevents module in Windows and Linux
// For more info, see: https://github.com/vinceau/project-clippi/issues/48
if (process.platform !== "darwin") {
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^fsevents$/,
    })
  );
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  if (isProduction) {
    config.mode = "production";
    config.devtool = "source-map";
  } else {
    config.mode = "development";
    config.devtool = "cheap-module-source-map";
  }

  return config;
};
