const chalk = require('chalk');
const sao = require('sao');
const path = require('path');
const { name: pkgName } = require('../../../package.json');
const { quiz, requireLocal, exec, checkYarn, getRepositoryUrl  } = require('../../utils');
const { getLatestVersion, compareVersion } = require('../../version');

module.exports = async(args) => {
  const ver = args.tag ? args.tag : '最新版'
  const answer = await quiz(`确认将${pkgName}升级到${ver}吗？`);

  if (answer) {
    const localPkg = requireLocal(`${pkgName}/package.json`);
    let version = args.tag;

    if (!version) {
      // 自动检测最新版本
      version = await getLatestVersion();
    }

    if (compareVersion(localPkg.version, version) > -1) {
      console.log(chalk `{cyan 当前版本 v${localPkg.version} 已是最新版本，无须升级！}`);
      return;
    }

    console.log(chalk `{cyan 开始升级脚手架...}`);
    console.log(chalk `{cyan 检查环境...}`);

    const hasYarn = checkYarn();
    const url = getRepositoryUrl(localPkg);

    try {
      let cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      let params = ['install', `${url}#${version}`];

      if (hasYarn) {
        const projectPkg = requireLocal(`./package.json`);
        console.log(chalk `{cyan 检测到yarn，使用yarn升级中...}`);
        cmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        params[0] = 'add';
        // 支持workspace
        if (projectPkg.workspaces) {
          params.splice(1, 0, '-W');
        }
      } else {
        console.log(chalk `{cyan 使用npm升级中...}`);
      }

      const success = await exec(cmd, params);

      if (success) {
        console.log(chalk `{cyan 正在升级相关配置文件...}`);

        // 执行本地刚更新完的最新脚本
        const generator = path.resolve(process.cwd(), 'node_modules', pkgName, 'lib/comands/upgrade');
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
      } else {
        console.log(chalk `{red 升级失败!}`);
      }
    } catch (err) {
      console.error(err);
      console.log(chalk `{red 升级失败!}`);
    }

  }
}