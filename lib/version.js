const simpleGit = require('simple-git');
const chalk = require('chalk');
const pkg = require('../package.json');
const { requireLocal, getRepositoryUrl } = require('./utils');

let latestVersion;

// 获取线上最新版本
const getLatestVersion = () => {
  if (latestVersion) {
    return Promise.resolve(latestVersion);
  }
  const repositoryUrl = getRepositoryUrl(pkg, true);
  return new Promise((resolve) => {
    simpleGit().listRemote(['--tags', repositoryUrl], (error, stdout) => {
      if (error) {
        console.log(`---------------------------- 版本检测失败 -------------------------------`)
        console.log(error);
        console.log(`------------------------------------------------------------------------`)
        latestVersion = `v${pkg.version}`;
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
      }
      resolve(latestVersion);
    });
  })
}

const checkCliVersion = async () => {
  try {
    let latest = await getLatestVersion();
    if (latest.replace(/^v/, '') > pkg.version) {
      const repositoryUrl = getRepositoryUrl(pkg)
      console.log(`---------------------------- cli升级提示 -------------------------------`)
      console.log(chalk `> {cyan hsbvue cli已发布新版本 ${latest}，建议升级。}`)
      console.log(chalk `> {cyan 升级方式：}`)
      console.log(chalk `> {cyan $ npm i -g ${repositoryUrl}#${latest}}`)
      console.log(`------------------------------------------------------------------------`)
    }
  } catch (err) {
    console.log(err);
  }
}

const checkLocalVersion = async () => {
  try {
    const { version } = requireLocal(`${pkg.name}/package.json`);
    let latest = await getLatestVersion();
    if (latest.replace(/^v/, '') > version) {
      console.log(`-------------------------- ${pkg.name}升级提示 ----------------------------`)
      console.log(chalk `> {cyan ${pkg.name}已发布新版本 ${latest}。如需升级，请使用以下命令：}`)
      console.log(chalk `> {cyan $ hsbvue upgrade -t ${latest}}`)
      console.log(`------------------------------------------------------------------------`)
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getLatestVersion,
  checkCliVersion,
  checkLocalVersion,
}