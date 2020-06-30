const webpackConfig = require('./webpack.config');

const baseConfig = webpackConfig({ dev: false });

module.exports = {
  ...baseConfig,
}
