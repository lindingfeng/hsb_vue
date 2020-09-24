const { exists } = require('../../../utils');

// 因旧项目样式问题可能会比较多，暂不添加任何规则，留待自行根据需求添加
// 注意保留缩进
const config = `{
  "ignoreFiles": ["**/iconfont.css"],
  "rules": {
  }
}`;

// 处理.stylelintrc文件
module.exports = async function() {
  const actions = [];

  if ( !(await exists('.stylelintrc')) ) {
    actions.push({
      type: 'add',
      files: '_stylelintrc',
    }, {
      type: 'modify',
      files: '_stylelintrc',
      handler() {
        return config;
      }
    })
  }

  return actions;
}
