const path = require('path');

module.exports = {
  mode: '<%= mode %>',
  extra: {
    px2rem: <%- extra.includes('px2rem') %>,  // 是否启用px2rem
    postCss: <%- extra.includes('postcss') %>, // 是否启用postCss
    extractCss: <%- extra.includes('extract') %>, // 是否抽离css
  },
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
