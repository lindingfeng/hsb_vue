const path = require('path');
const { name: pkgName } = require('../package.json');
const setup = require('./setup');
const createCmd = require('./comands/create');
const devCmd = require('./comands/dev');
const buildCmd = require('./comands/build');
const upgradeCmd = require('./comands/upgrade');
const migrateCmd = require('./comands/migrate');

function packageExists (name) {
  try {
    require.resolve(path.join(process.cwd(), 'node_modules', name));
    return true
  } catch (e) {
    return false
  }
}

const run = async function (cmd, argv, checkPackage = true) {
  if (checkPackage && !packageExists(pkgName)) {
    throw new Error(`The module \`${pkgName}\` is not found, please install it before run.`);
  }

  const dev = cmd === 'dev';

  setup({ dev });

  switch(cmd) {
    case 'create':
      await createCmd(argv);
      break;
    case 'dev':
      await devCmd(argv);
      break;
    case 'build':
      await buildCmd(argv);
      break;
    case 'upgrade':
      await upgradeCmd(argv);
      break;
    case 'migrate':
      await migrateCmd(argv);
      break;
  }
};

module.exports = run;
