const html = require('./html');
const package = require('./package');
const pack = require('./pack');
const stylelint = require('./stylelint');

module.exports = async function() {
  const actions = [
    {
      type: 'add',
      files: 'hsbvue.config.js',
    },
    {
      type: 'add',
      files: '_babelrc',
    },
    {
      type: 'add',
      files: '_stylelintrc',
    },
  ];

  // 处理package.json
  const packageActions = await package();
  actions.push(...packageActions);

  // 处理html
  const htmlActions = await html();
  actions.push(...htmlActions);

  // 处理pack.sh
  const packActions = await pack();
  actions.push(...packActions);

  // 处理.stylelintrc
  const stylelintActions = await stylelint();
  actions.push(...stylelintActions);

  // 整理文件
  actions.push({
    type: 'move',
    patterns: {
        _babelrc: '.babelrc',
        _stylelintrc: '.stylelintrc',
    }
  })
  return actions;
}
