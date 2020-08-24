const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = (options) => {
  const baseConfig = webpackConfig(options);
  return merge(baseConfig, {
    plugins: [
      new CleanWebpackPlugin(),
    ],
  });
};
