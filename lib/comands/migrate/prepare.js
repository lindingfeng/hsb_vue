const chalk = require('chalk');
const { getOriginConfig } = require('./helper');
const { exists } = require('../../utils');

const checkFile = async (mode) => {
  const files = mode === 'spa' ? ['src/main.js'] : ['src/entry'];
  let isOk = true;
  for (let i in files) {
    if (!isOk) break;
    isOk = await exists(files[i]);
  }
  return isOk;
}

module.exports = async function() {
  console.log();
  console.log(chalk `{cyan 正在检查环境...}`);

  const config = getOriginConfig();
  const mode = config.multiple ? 'universal' : 'spa';
  const isOk = await checkFile(mode);
  if (!isOk) {
    throw this.createError('迁移失败，入口文件 main.js 缺失');
  }

  console.log(chalk `{cyan 正在迁移...}`);
}
