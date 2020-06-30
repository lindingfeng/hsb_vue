const path = require('path');
const webpackConfig = require('./webpack.config');

const baseConfig = webpackConfig({ dev: true });

module.exports = {
  ...baseConfig,
  devServer: {
    contentBase: path.join(process.cwd(), './dist'),
    hot: true,
    port: 3000,
    host: '127.0.0.1',
    historyApiFallback: true,
    overlay: { warnings: false, errors: true },
    // quiet: false,
  }
}
