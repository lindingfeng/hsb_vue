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
    console.log(chalk `{cyan ✨ 迁移完成，正在更新本地npm依赖...}`);
    await this.npmInstall();
    console.log();
    console.log(`----------------------------- 新增指令 ---------------------------------`)
    console.log(chalk `> {green $ npm run hsb:dev}          # 开发模式`);
    console.log(chalk `> {green $ npm run hsb:build}        # 打包生产环境代码`);
    console.log(chalk `> {green $ npm run hsb:build:test}   # 打包测试环境代码`);
    console.log(`------------------------------------------------------------------------`)
    console.log(chalk `{cyan ✨ 迁移成功！(如启动失败，请执行npm i或yarn install更新依赖)}`);
  }
}
