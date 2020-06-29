const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const { name: pkgName } = require('../../package.json');
const { quiz, requireLocal } = require('../utils');

// 检查是否存在yarn
const checkYarn = () => {
  const yarnFile = path.join(process.cwd(), 'yarn.lock');
  const fileExists = fs.existsSync(yarnFile)
  if (!fileExists) return false;
  const cmdExists = commandExistsSync('yarn');
  return cmdExists;
}

// 调用系统命令
const exec = (cmd, args = []) => {
  return new Promise((resolve, reject) => {
    const x = spawn(cmd, args);
    x.stdout.on('data', (data) => {
      console.log(String(data));
    });
    x.on('close', (code) => {
      resolve(code === 0);
    })
    x.on('error', (err) => {
      reject(err);
    })
  })
}

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