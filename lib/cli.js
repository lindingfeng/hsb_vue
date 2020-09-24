#!/usr/bin/env node

const cac = require('cac');
const chalk = require('chalk');
const run = require('./run');
const { version } = require('../package.json');
const { checkCliVersion, checkLocalVersion } = require('./version');

const cli = cac('hsbvue');

cli
    .command('create [out-dir]', '生成一个新项目到指定目录或当前目录（out-dir）')
    .option('--verbose', '显示debug日志')
    .action(async (outDir = '.', cliOptions) => {
        await checkCliVersion();
        run('create', { ...cliOptions, outDir }, false);
    });

cli
    .command('dev', '开发模式')
    .option('-h, --host [host]', '修改启动host')
    .option('-p, --port [port]', '修改启动端口号')
    .option('-e, --env [env]', '修改运行环境')
    .option('-w, --workspace [workspace]', '设定workspace')
    .action((cliOptions) => {
        checkLocalVersion();
        console.log(chalk `{cyan ✨ 启动开发模式...}`)
        run('dev', cliOptions);
    });

cli
    .command('build', '打包生产环境代码')
    .option('-e, --env [env]', '修改运行环境')
    .option('-w, --workspace [workspace]', '设定workspace')
    .action((cliOptions) => {
        checkLocalVersion();
        console.log(chalk `{cyan ✨ 开始编译...}`)
        run('build', cliOptions);
    });

cli
    .command('upgrade', '升级脚手架')
    .option('-t, --tag [tag]', '升级到指定版本')
    .action(async (cliOptions) => {
        await checkCliVersion();
        run('upgrade', cliOptions);
    });

cli
    .command('migrate', '从旧版vue_webpack迁移到hsbvue')
    .option('--verbose', '显示debug日志')
    .action(async (cliOptions) => {
        await checkCliVersion();
        run('migrate', cliOptions, false);
    });

cli.help();

cli.version(version);

cli.parse();
