const mainPkg = require('../../../../package.json');

// 处理package.json文件
module.exports = async function() {
  const actions = [
    {
      type: 'modify',
      files: 'package.json',
      handler(data) {
        // 添加依赖
        data.dependencies = {
          [mainPkg.name]: `${mainPkg.repository.url || mainPkg.repository}#v${mainPkg.version}`,
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
        const keys = Object.keys(mainPkg.dependencies);
        keys.push('babel-cli', 'babel-core');
        keys.forEach(key => {
          delete data.dependencies[key];
          if (data.devDependencies) {
            delete data.devDependencies[key];
          }
        });
        return data
      }
    }
  ];
  return actions;
}
