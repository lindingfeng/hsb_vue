const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const cfg = require('../cfg');

module.exports = async (args) => {
  const config = cfg({ dev: true });

  const compiler = webpack(config.webpackConfig);
  const devServerOptions = Object.assign({}, config.webpackConfig.devServer, {
    open: true,
    stats: {
      colors: true,
    },
  });

  const server = new webpackDevServer(compiler, devServerOptions);

  const host = process.env.host || args.host || devServerOptions.host || '127.0.0.1';
  const port = process.env.PORT || args.port || devServerOptions.port || 3000;

  server.listen(port, host, () => {
    console.log(`Starting server on http://${host}:${port}`);
  });
}
