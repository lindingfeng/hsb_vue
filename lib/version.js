const { exec } = require('child_process');
const chalk = require('chalk');
const { repository, version, name: pkgName } = require('../package.json');
const { requireLocal } = require('./utils');

let latestVersion;

// 获取线上最新版本
const getLatestVersion = () => {
  if (latestVersion) {
    return Promise.resolve(latestVersion);
  }
  let repositoryUrl = repository.url || repository || '';
  repositoryUrl = repositoryUrl.replace(/^git\+/, '');
  return new Promise((resolve, reject) => {
    exec(`git ls-remote --tags ${repositoryUrl}`, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      } else {
        const re = /refs\/tags\/(.+)/g
        let version = '';
        let v;
        while((v = re.exec(stdout)) != null) {
          if (v[1] > version) {
            version = v[1];
          }
        }
        latestVersion = version;
        resolve(latestVersion);
      }
    });
  })
}

const checkCliVersion = async () => {
  try {
    let latest = await getLatestVersion();
    if (latest.replace(/^v/, '') > version) {
      console.log(`---------------------------- cli升级提示 -------------------------------`)
      console.log(chalk `{cyan hsbvue cli已发布新版本 ${latest}，建议升级。}`)
      console.log(chalk `{cyan 升级方式：}`)
      console.log(chalk `{cyan npm i -g ${repository.url || repository}#${latest}}`)
      console.log(`------------------------------------------------------------------------`)
    }
  } catch (err) {
    console.log(err);
  }
}

const checkLocalVersion = async () => {
  try {
    const { version } = requireLocal(`${pkgName}/package.json`);
    let latest = await getLatestVersion();
    if (latest.replace(/^v/, '') > version) {
      console.log(`-------------------------- ${pkgName}升级提示 ----------------------------`)
      console.log(chalk `{cyan ${pkgName}已发布新版本 ${latest}。如需升级，请使用以下命令：}`)
      console.log(chalk `{cyan hsbvue upgrade -t ${latest}}`)
      console.log(`------------------------------------------------------------------------`)
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  checkCliVersion,
  checkLocalVersion,
}