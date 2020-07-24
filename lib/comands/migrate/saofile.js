const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra');
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
    console.log(chalk `{cyan 正在清理node_modules...}`);
    await fse.removeSync(path.resolve(process.cwd(), 'node_modules'));
    console.log();
    console.log(`----------------------------- 新增指令 ---------------------------------`)
    console.log(chalk `> {green $ npm run hsb:dev}          # 开发模式`);
    console.log(chalk `> {green $ npm run hsb:build}        # 打包生产环境代码`);
    console.log(chalk `> {green $ npm run hsb:build:test}   # 打包测试环境代码`);
    console.log(`------------------------------------------------------------------------`)
    console.log(chalk `{cyan ✨ 迁移成功！请手动执行 npm i 或 yarn install 更新依赖}`);
  }
}
