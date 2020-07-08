const webpackConfig = require('./webpack.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (options) => {
  const config = webpackConfig(options);
  config.plugins.push(new CleanWebpackPlugin());
  return config;
};
