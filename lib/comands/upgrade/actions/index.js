const babelrc = require('./babelrc');
const package = require('./package');

module.exports = function(templateDir) {
  const getActions = async () => {
    const actions = [];

    // 处理package.json
    const packageActions = await package();
    actions.push(...packageActions);

    // 处理babelrc配置
    const babelrcActions = await babelrc(templateDir);
    actions.push(...babelrcActions);

    return actions;
  }

  return getActions;
}
