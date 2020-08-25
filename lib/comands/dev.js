const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const cfg = require('../cfg');

// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

module.exports = async (args) => {
  const config = cfg({ env: 'local', ...args, dev: true });

  const compiler = webpack(config.webpackConfig);
  // const compiler = webpack(smp.wrap(config.webpackConfig)); // 性能调试用
  const devServerOptions = Object.assign({
    open: true,
    stats: {
      colors: true,
    }
  }, config.webpackConfig.devServer);

  const server = new webpackDevServer(compiler, devServerOptions);

  const host = process.env.host || args.host || devServerOptions.host || '127.0.0.1';
  const port = process.env.PORT || args.port || devServerOptions.port || 3000;

  server.listen(port, host, () => {
    server.log.info(`Starting server on http://${host}:${port}`);
    server.log.info('Compiling...');
  });
}
