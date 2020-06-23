const webpack = require('webpack');
const cfg = require('../cfg');

module.exports = async (args) => {
  const config = cfg({ dev: false });
  webpack(config.webpackConfig, (err) => {
    if (err) {
      console.error(err);
    }
  });
}