const chalk = require('chalk');
const { name: pkgName } = require('../../package.json');
const { quiz, requireLocal, exec, checkYarn } = require('../utils');

// 获取hsbvue地址
const getPkgUrl = (pkgName) => {
  const pkg = requireLocal('./package.json');
  const url = pkg.dependencies && pkg.dependencies[pkgName]
    || pkg.devDependencies && pkg.devDependencies[pkgName];
  return url.replace(/\#.+$/, '') || null;
}

module.exports = async(args) => {
  const ver = args.tag ? args.tag : '最新版'
  const answer = await quiz(`确认将${pkgName}升级到${ver}吗？`);
  if (answer) {
    console.log(chalk `{cyan 开始升级脚手架...}`);

    console.log(chalk `{cyan 检查环境...}`);

    const hasYarn = checkYarn();
    const url = getPkgUrl(pkgName);

    try {
      let cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      let params = ['install', args.tag ? `${url}#${args.tag}` : url];

      if (hasYarn) {
        console.log(chalk `{cyan 检测到yarn，使用yarn升级...}`);
        cmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        params[0] = 'add';
        // clean yarn cache.
        await exec(cmd, ['cache', 'clean' , pkgName]);
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