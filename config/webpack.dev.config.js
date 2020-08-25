const path = require('path');
const { merge } = require("webpack-merge");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = (options) => {
  const baseConfig = webpackConfig(options);
  return merge(baseConfig, {
    plugins: [
      new CaseSensitivePathsPlugin(),
    ],
    devServer: {
      contentBase: path.join(process.cwd(), './dist'),
      hot: true,
      port: 3000,
      host: '127.0.0.1',
      disableHostCheck: true,
      historyApiFallback: true,
      overlay: { warnings: false, errors: true },
      stats: 'minimal',
      watchOptions: {
        ignored: /node_modules|static/,
        aggregateTimeout: 300,
      },
    }
  });
};
