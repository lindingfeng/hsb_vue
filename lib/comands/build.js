const chalk = require('chalk');
const webpack = require('webpack');
const cfg = require('../cfg');

module.exports = async (args) => {
  const config = cfg({ env: 'product', ...args, dev: false });

  webpack(config.webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      } else {
        const info = stats.toJson();
        console.error(info.errors);
      }
      console.log(chalk `{red 编译失败!}`)
    } else {
      console.log(chalk `{cyan ✨ 编译完成!}`)
    }
  
  });
}