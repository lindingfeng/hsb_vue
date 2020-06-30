const path = require('path');

module.exports = {
  mode: 'spa',
  webpack(config, { dev }) {
    // 自定义webpack配置
    config.resolve  = {
      ...config.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    };
    return config;
  }
}
