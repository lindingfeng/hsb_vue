const chalk = require('chalk');
const { name: pkgName } = require('../../package.json');
const { quiz, requireLocal, exec, checkYarn } = require('../utils');
const { getLatestVersion } = require('../version');

const localPkg = requireLocal(`${pkgName}/package.json`);

// 获取hsbvue地址
const getPkgUrl = () => {
  const { repository } = localPkg;
  return repository ? repository.url || repository : null;
}

module.exports = async(args) => {
  const ver = args.tag ? args.tag : '最新版'
  const answer = await quiz(`确认将${pkgName}升级到${ver}吗？`);

  if (answer) {
    let version = args.tag;

    if (!version) {
      // 自动检测最新版本
      version = await getLatestVersion();
    }

    if (version.replace(/^v/, '') <= localPkg.version) {
      console.log(chalk `{cyan 当前版本 v${localPkg.version} 已是最新版本，无须升级}`);
      return;
    }

    console.log(chalk `{cyan 开始升级脚手架...}`);
    console.log(chalk `{cyan 检查环境...}`);

    const hasYarn = checkYarn();
    const url = getPkgUrl();

    try {
      let cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      let params = ['install', `${url}#${version}`];

      if (hasYarn) {
        console.log(chalk `{cyan 检测到yarn，使用yarn升级...}`);
        cmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        params[0] = 'add';
      } else {
        console.log(chalk `{cyan 使用npm升级...}`);
      }

      const success = await exec(cmd, params);

      if (success) {
        console.log(chalk `{cyan ✨ 升级成功!}`);
      } else {
        console.log(chalk `{red 升级失败!}`);
      }
    } catch (err) {
      console.error(err);
      console.log(chalk `{red 升级失败!}`);
    }

  }
}