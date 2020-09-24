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

module.exports = {
  getOriginConfig,
}
