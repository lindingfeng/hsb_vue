const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const { getLatestVersion } = require('./version');
const pkg = require('../package.json');

const getVersion = async () => {
  let version = process.argv[2];
  if (version) {
    return version;
  } else {
    const latest = await getLatestVersion();
    version = latest.replace(/\d+$/, (a) => {
      return Number(a) + 1;
    });
    return version;
  }
} 

const release = async () => {
  const version = await getVersion();

  const pkgFile = path.resolve(__dirname, '../package.json');
  pkg.version = version.replace(/^v/, '');
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 4));

  const git = simpleGit();
  await git.commit(`chore: release ${version}`, ['package.json']);
  await git.addTag(version);
  await git.pushTags('origin');

  console.log(chalk `{cyan ✨ Released ${version}}`);
}

release();
