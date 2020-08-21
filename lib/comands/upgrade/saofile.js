const chalk = require('chalk');
const path = require('path');
const actions = require('./actions');

const templateDir = path.resolve(__dirname, '../../..', 'template');

module.exports = {
  templateDir,
  templateData: {},
  actions: actions(templateDir),
  prompts: [],
  async completed() {
    console.log();
    console.log(chalk `{cyan ✨ 升级成功！请手动执行 npm i 或 yarn install 更新依赖}`);
  }
}
