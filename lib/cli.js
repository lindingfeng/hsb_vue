#!/usr/bin/env node

const path = require('path');
const sao = require('sao');
const cac = require('cac');
const chalk = require('chalk');
const run = require('./run');
const { version } = require('../package.json');
const { checkCliVersion, checkLocalVersion } = require('./version');

const generator = path.resolve(__dirname, './');

const cli = cac('hsbvue');

cli
    .command('create [out-dir]', '生成一个新项目到指定目录或当前目录（out-dir）')
    .option('--verbose', '显示debug日志')
    .action((outDir = '.', cliOptions) => {
        console.log()
        console.log(chalk `{cyan hsbvue v${version}}`)
        console.log(chalk `✨ 生成新项目到 {cyan ${outDir}}`)

        const { verbose } = cliOptions

        const logLevel = verbose ? 4 : 2

        // See https://saojs.org/api.html#standalone-cli
        sao({ generator, outDir, logLevel, cliOptions })
            .run()
            .catch((err) => {
                console.trace(err)
                process.exit(1)
            });
    });

cli
    .command('dev', '开发模式')
    .option('-h, --host [host]', '修改启动host')
    .option('-p, --port [port]', '修改启动端口号')
    .option('-e, --env [env]', '修改运行环境')
    .action((cliOptions) => {
        console.log(chalk `{cyan ✨ 启动开发模式...}`)
        run('dev', cliOptions);
    });

cli
    .command('build', '打包生产环境代码')
    .option('-e, --env [env]', '修改运行环境')
    .action((cliOptions) => {
        console.log(chalk `{cyan ✨ 开始编译...}`)
        run('build', cliOptions);
    });

cli
    .command('upgrade', '升级脚手架')
    .option('-t, --tag [tag]', '升级到指定版本')
    .action((cliOptions) => {
        run('upgrade', cliOptions);
    });

cli.help();

cli.version(version);

cli.parse();

checkCliVersion();

checkLocalVersion();
