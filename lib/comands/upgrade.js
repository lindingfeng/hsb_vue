const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const { name: pkgName } = require('../../package.json');
const { quiz } = require('../utils');

// 检查是否存在yarn
const checkYarn = () => {
  const yarnFile = path.join(process.cwd(), 'yarn.lock');
  const fileExists = fs.existsSync(yarnFile)
  if (!fileExists) return false;
  const cmdExists = commandExistsSync('yarn');
  return cmdExists;
}

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

module.exports = async (args) => {
  const answer = await quiz(`确认将${pkgName}升级到最新版吗？`);
  if (answer) {
    console.log(chalk `{cyan 开始升级脚手架...}`);

    console.log(chalk `{cyan 检查环境...}`);

    const hasYarn = checkYarn();

    let success;

    try {
      if (hasYarn) {
        console.log(chalk `{cyan 检测到yarn，使用yarn升级...}`);
        const cmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        success = await exec(cmd, ['upgrade', pkgName]);
      } else {
        console.log(chalk `{cyan 检测到npm，使用npm升级...}`);
        const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        success = await exec(cmd, ['update', pkgName]);
      }

      if (success) {
        console.log(chalk `{cyan ✨ 升级成功!}`);
      }
    } catch (err) {
      console.error(err);
      console.log(chalk `{red 升级失败!}`);
    }
    
  }
}