const path = require('path');
const { name: pkgName } = require('../package.json');
const setup = require('./setup');
const devCmd = require('./comands/dev');
const buildCmd = require('./comands/build');

function packageExists (name) {
  try {
    require.resolve(path.join(process.cwd(), 'node_modules', name));
    return true
  } catch (e) {
    return false
  }
}

const run = async function (cmd, argv) {
  if (!packageExists(pkgName)) {
    throw new Error(`The module \`${pkgName}\` is not found, please install it before run.`);
  }

  const dev = cmd === 'dev';

  setup({ dev });

  switch(cmd) {
    case 'dev':
      await devCmd(argv);
      break;
    case 'build':
      await buildCmd(argv);
      break;
  }
};

module.exports = run;
