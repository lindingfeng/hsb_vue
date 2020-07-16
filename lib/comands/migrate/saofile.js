const chalk = require('chalk');
const path = require('path');
const actions = require('./actions');
const templateData = require('./templateData');
const prepare = require('./prepare');

const templateDir = path.resolve(__dirname, '../../../template');

module.exports = {
  templateDir,
  templateData,
  actions,
  prompts: [],
  prepare,
  async completed() {
    console.log();
    console.log(`----------------------------- 新增指令 ---------------------------------`)
    console.log(chalk `> {green $ npm run hsb:dev}          # 开发模式`);
    console.log(chalk `> {green $ npm run hsb:build}        # 打包生产环境代码`);
    console.log(chalk `> {green $ npm run hsb:build:test}   # 打包测试环境代码`);
    console.log(`------------------------------------------------------------------------`)
    console.log(chalk `{red hsbvue依赖自治，请移除node_modules目录后重新运行 npm i 安装依赖}`);
    console.log(chalk `{cyan ✨ 迁移成功！}`);
  }
}
