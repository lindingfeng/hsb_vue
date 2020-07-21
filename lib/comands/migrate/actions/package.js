const mainPkg = require('../../../../package.json');
const { exists, getFileEOL } = require('../helper');

// 需要从旧依赖中移除的包
const cleanPackageKeys = Object.keys(mainPkg.dependencies);
cleanPackageKeys.push('babel-cli', 'babel-core');

// 处理package.json相关文件
module.exports = async function() {
  const actions = [
    {
      type: 'modify',
      files: 'package.json',
      handler(data) {
        // 添加依赖
        data.dependencies = {
          [mainPkg.name]: `${mainPkg.repository.url || mainPkg.repository}#v${mainPkg.version}`,
          'hsb-release': '^1.1.2',
          ...data.dependencies,
        }
        // 添加指令
        data.scripts = {
          'hsb:dev': 'hsbvue dev',
          "hsb:build": "hsbvue build",
          "hsb:build:test": "hsbvue build --env=test",
          ...data.scripts,
        }
        // 清理与hsbvue冲突的依赖
        cleanPackageKeys.forEach(key => {
          delete data.dependencies[key];
          if (data.devDependencies) {
            delete data.devDependencies[key];
          }
        });
        return data
      }
    }
  ];

  // 清理pakcage-lock.json
  if (exists('package-lock.json')) {
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
  if (exists('yarn.lock')) {
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

  // 添加release配置文件
  if ( !(await exists('release.config.json')) ) {
    actions.push({
      type: 'add',
      files: 'release.config.json',
    });
  }
  return actions;
}
