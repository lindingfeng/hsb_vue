const path = require('path');
const chalk = require('chalk');
const sao = require('sao');
const { version } = require('../../../package.json');

module.exports = async (args) => {
  const { verbose, outDir } = args;

  console.log()
  console.log(chalk `{cyan hsbvue v${version}}`)
  console.log(chalk `✨ 生成新项目到 {cyan ${outDir}}`)

  const generator = path.resolve(__dirname, './');

  const logLevel = verbose ? 4 : 2;

  // See https://saojs.org/api.html#standalone-cli
  sao({ generator, outDir, logLevel, cliOptions: args })
    .run()
    .catch((err) => {
        console.trace(err)
        process.exit(1)
    });
}