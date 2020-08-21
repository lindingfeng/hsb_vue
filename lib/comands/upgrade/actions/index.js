const babelrc = require('./babelrc');

module.exports = function(templateDir) {
  const getActions = async () => {
    const actions = [];

    // 处理babelrc配置
    const babelrcActions = await babelrc(templateDir);
    actions.push(...babelrcActions);

    return actions;
  }

  return getActions;
}
