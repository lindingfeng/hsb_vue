const path = require('path');
const fs = require('fs');
const { requireLocal } = require('../../utils');

// 读取旧版配置
const getOriginConfig = () => {
  let config;
  try {
    config = {
      ...requireLocal('./scripts/config'),
      ...requireLocal('./src/config/scriptConfig'),
    }
  } catch (err) {
    config = {}
  }
  return config;
}

const exists = (pathname) => {
  return new Promise(resolve => {
    const file = path.join(process.cwd(), pathname)
    fs.access(file, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  })
}

module.exports = {
  getOriginConfig,
  exists,
}
