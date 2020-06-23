const { requireLocal, merge } = require('./utils');
const { name: pkgName } = require('../package.json');

module.exports = ({ dev }) => {
  // 加载预定义webpack配置
  let webpackConfig;
  if (dev) {
    webpackConfig = requireLocal(`${pkgName}/config/webpack.dev.config`);
  } else {
    webpackConfig = requireLocal(`${pkgName}/config/webpack.production.config`);
  }
  const customConfig = requireLocal('./hsbvue.config');

  if (typeof customConfig.webpack === 'function') {
    // 自定义webpack
    const cusWebpack = customConfig.webpack(webpackConfig, { dev });
    webpackConfig = merge(webpackConfig, cusWebpack);
  }

  const config = {
    webpackConfig,
    ...customConfig,
  };
  return config;
}
