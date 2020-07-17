const path = require('path');

module.exports = {
  mode: '<%= mode %>',
  head: {
    title: '<%= name %>',
    meta: {
      keywords: '<%= name %>',
      description: '<%= description %>',
    },
    // script: [
    // 	{ src: '' }
    // ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: './static/favicon.ico' }
    ]
  },
  extra: {
    usePx2rem: <%- extra.includes('px2rem') %>, // 是否启用px2rem
    usePostCSS: <%- extra.includes('postcss') %>, // 是否启用postCss
    useExtractCSS: <%- extra.includes('extract') %>, // 是否抽离css
  },
  webpack(config, { dev }) {
    // 自定义webpack配置
    config.resolve  = {
      ...config.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    };

    if (dev) {
      // 开发环境专项配置
      config.devServer = {
        ...config.devServer,
        proxy: {}
      }
    }
    return config;
  },
  analyzer: false // 打包文件分析
}
