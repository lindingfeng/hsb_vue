#!/usr/bin/env node

const path = require('path');
const sao = require('sao');
const cac = require('cac');
const chalk = require('chalk');
const { version } = require('../package.json');

const generator = path.resolve(__dirname, './');

const cli = cac('hsbvue');

cli
    .command('create [out-dir]', '生成一个新项目到指定目录或当前目录（out-dir）')
    .option('--verbose', '显示debug日志')
    .action((outDir = '.', cliOptions) => {
        console.log()
        console.log(chalk `{cyan hsbvue v${version}}`)
        console.log(chalk `✨ 生成新项目到{cyan ${outDir}}`)

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
    .action((cliOptions) => {
        console.log('启动开发模式')
    });

cli
    .command('build', '编译生产环境代码')
    .action((cliOptions) => {
        console.log('编译生产环境代码')
    });

cli
    .command('update', '更新脚手架')
    .action((cliOptions) => {
        console.log('更新脚手架')
    });

cli.help();

cli.version(version);

cli.parse();