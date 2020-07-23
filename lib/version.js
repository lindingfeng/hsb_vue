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

// 检查cli是否有新版
const checkCliVersion = async () => {
  try {
    let latest = await getLatestVersion();
    if (compareVersion(latest, pkg.version) === 1) {
    // if (latest.replace(/^v/, '') > pkg.version) {
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

// 检查本地@hsb/vue是否有新版
const checkLocalVersion = async () => {
  try {
    const { version } = requireLocal(`${pkg.name}/package.json`);
    let latest = await getLatestVersion();
    if (compareVersion(latest, version) === 1) {
    // if (latest.replace(/^v/, '') > version) {
      console.log(`-------------------------- ${pkg.name}升级提示 ----------------------------`)
      console.log(chalk `> {cyan ${pkg.name}已发布新版本 ${latest}。如需升级，请使用以下命令：}`)
      console.log(chalk `> {cyan $ hsbvue upgrade -t ${latest}}`)
      console.log(`------------------------------------------------------------------------`)
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * 版本号比较，返回 0、-1、1
 * @param {string} version1 版本号1
 * @param {string} version2 版本号2
 * @returns {number}        返回结果，0: 相等，-1: 小于，1: 大于
 */
const compareVersion = (version1, version2) => {
  const v1s = version1.replace(/^v/, '').split('.');
  const v2s = version2.replace(/^v/, '').split('.');
  const length = Math.max(v1s.length, v2s.length);
  for (let i = 0; i < length; i++) {
      if (!v1s[i]) v1s[i] = 0;
      if (!v2s[i]) v2s[i] = 0;
  }
  let result = 0;
  v1s.some((v1, index) => {
      result = Math.sign(v1 - v2s[index]);
      return result !== 0;
  });
  return result;
}

module.exports = {
  getLatestVersion,
  checkCliVersion,
  checkLocalVersion,
  compareVersion,
}