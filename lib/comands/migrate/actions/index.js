const hsbvueConfig = require('./hsbvueConfig');
const html = require('./html');
const package = require('./package');
const pack = require('./pack');
const stylelint = require('./stylelint');

module.exports = async function() {
  const actions = [
    {
      type: 'add',
      files: '_babelrc',
    },
    {
      type: 'add',
      files: '_stylelintignore',
    },
    {
      type: 'add',
      files: 'README.md',
    },
    {
      type: 'modify',
      files: 'README.md',
      handler(data) {
        data = data.replace(/npm run (\w)/g, 'npm run hsb:$1');
        return data;
      }
    }
  ];

  // 处理hsbvue.config.js
  const configActions = await hsbvueConfig();
  actions.push(...configActions);

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
        _stylelintignore: '.stylelintignore',
    }
  })

  // 清理与hsbvue冲突的文件
  actions.push({
    type: 'remove',
    files: '@(babel.config.js|.babelrc.js)',
  })
  return actions;
}
