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

// 判断本地是否存在指定文件/文件夹
const exists = (pathname) => {
  return new Promise(resolve => {
    const file = path.join(process.cwd(), pathname)
    fs.access(file, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  })
}

// 获取文件换行符
const getFileEOL = (chunk) => {
  if (chunk.includes('\r\n')) {
    return '\r\n';
  } else if (chunk.includes('\r') && !chunk.includes('\n')) {
    return '\r';
  }
  return '\n';
}

module.exports = {
  getOriginConfig,
  exists,
  getFileEOL,
}
