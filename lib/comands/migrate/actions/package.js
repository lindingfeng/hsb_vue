const mainPkg = require('../../../../package.json');
const { exists, getFileEOL } = require('../helper');
const { getRepositoryUrl } = require('../../../utils');
const { compareVersion } = require('../../../version');

// 需要从旧依赖中移除的包
const cleanPackageKeys = Object.keys(mainPkg.dependencies);
cleanPackageKeys.push('babel-cli', 'babel-core', 'node-sass');

// 处理package.json相关文件
module.exports = async function() {
  const actions = [
    {
      type: 'modify',
      files: 'package.json',
      async handler(data) {
        const repositoryUrl = getRepositoryUrl(mainPkg);
        // 添加依赖
        data.dependencies = {
          [mainPkg.name]: `${repositoryUrl}#v${mainPkg.version}`,
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

        // 检测vue版本
        // vue版本低于v2.6.1时编译将不成功
        let vueVersion = (data.dependencies && data.dependencies.vue) || '';
        vueVersion = vueVersion.replace(/^[^\d]/, '');
        if (compareVersion(vueVersion, '2.6.1') === -1) {
          data.dependencies['vue'] = '^2.6.1';
          data.devDependencies['vue-template-compiler'] = '^2.6.11';
        }

        // 清理与hsbvue冲突的依赖
        cleanPackageKeys.forEach(key => {
          delete data.dependencies[key];
          if (data.devDependencies) {
            delete data.devDependencies[key];
          }
        });

        // 清理与hsbvue冲突的配置
        delete data.babel;

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
