const webpackConfig = require('./webpack.config');

module.exports = (options) => {
  const config = webpackConfig(options);
  return config;
};
