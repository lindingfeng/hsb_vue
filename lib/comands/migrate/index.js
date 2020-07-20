const path = require('path');
const chalk = require('chalk');
const sao = require('sao');
const { quiz } = require('../../utils');

module.exports = async (args) => {
  console.log(`----------------------------- 迁移提示 ---------------------------------`)
  console.log('> 该操作将会修改以下文件（包括但不限于）：');
  console.log(chalk `> {red package.json, README.md, index.html, pack.sh, .babelrc, .stylelintrc}`);
  console.log('> 迁移前请做好备份');
  console.log(`------------------------------------------------------------------------`)
  console.log();

  const answer = await quiz(`确认要迁移到 hsbvue 吗？`);
  if (!answer) return;

  const generator = path.resolve(__dirname, './');

  const { verbose } = args;
  const logLevel = verbose ? 4 : 2;

  const outDir = path.resolve(process.cwd());

  // See https://saojs.org/api.html#standalone-cli
  sao({ generator, outDir, logLevel, cliOptions: args })
    .run()
    .catch((err) => {
        console.trace(err)
        process.exit(1)
    });
}