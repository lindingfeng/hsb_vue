const mainPkg = require('../../../../package.json');
const { getRepositoryUrl, exists, getFileEOL } = require('../../../utils');

// 需要从旧依赖中移除的包
const cleanPackageKeys = Object.keys(mainPkg.dependencies);
cleanPackageKeys.push('babel-cli', 'babel-core', 'node-sass');
cleanPackageKeys.push(mainPkg.name); // 清理自身，以便更新

// 处理package.json相关文件
module.exports = async function() {
  const actions = [
    {
      type: 'modify',
      files: 'package.json',
      async handler(data) {
        const repositoryUrl = getRepositoryUrl(mainPkg);
        // 更新依赖
        data.dependencies = {
          ...data.dependencies,
          [mainPkg.name]: `${repositoryUrl}#v${mainPkg.version}`,
        }
        return data
      }
    }
  ];

  // 清理pakcage-lock.json
  if (await exists('package-lock.json')) {
    actions.push({
      type: 'modify',
      files: 'package-lock.json',
      handler(data) {
        // 清理与hsbvue冲突的依赖
        cleanPackageKeys.forEach(key => {
          delete data.dependencies[key];
        });
        return data
      }
    });
  }

  // 清理yarn.lock
  if (await exists('yarn.lock')) {
    actions.push({
      type: 'modify',
      files: 'yarn.lock',
      handler(data) {
        // 清理与hsbvue冲突的依赖
        let eol = getFileEOL(data);
        eol = `${eol}${eol}`; // '\n\n'
        const result = data.split(eol).filter(chunk => {
          const found = cleanPackageKeys.some(key => {
            const index = chunk.indexOf(`${key}@`);
            return index === 0 || index === 1;
          });
          return !found;
        });
        return result.join(eol);
      }
    });
  }

  return actions;
}
