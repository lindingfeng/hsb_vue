const { requireLocal, merge } = require('./utils');
const { name: pkgName } = require('../package.json');

module.exports = ({ dev, env }) => {
  const customConfig = requireLocal('./hsbvue.config');

  // 合并用户配置 & 默认配置
  const hsbConfig = merge({
    dev,
    env,
    head: {},
    extra: {
      usePx2rem: false,
      usePostCSS: false,
      useExtractCSS: false,
    }
  }, customConfig);

  // 加载预定义webpack配置
  let webpackConfig;
  if (dev) {
    webpackConfig = requireLocal(`${pkgName}/config/webpack.dev.config`)(hsbConfig);
  } else {
    webpackConfig = requireLocal(`${pkgName}/config/webpack.production.config`)(hsbConfig);
  }

  if (typeof hsbConfig.webpack === 'function') {
    // 处理自定义webpack
    const cusWebpack = hsbConfig.webpack(webpackConfig, { dev });
    webpackConfig = merge(webpackConfig, cusWebpack);
  }

  const config = {
    webpackConfig,
    ...hsbConfig,
  };
  return config;
}
