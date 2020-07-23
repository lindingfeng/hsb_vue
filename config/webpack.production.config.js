const { merge } = require("webpack-merge");
const webpackConfig = require('./webpack.config');

module.exports = (options) => {
  const baseConfig = webpackConfig(options);
  return merge(baseConfig, {
  });
};
