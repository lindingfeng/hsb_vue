const { parse } = require("@babel/parser");
const { default: traverse } = require('@babel/traverse');
const { default: generator } = require('@babel/generator');
const { default: template } = require('@babel/template');
const { getOriginConfig } = require('../helper');
const { exists } = require('../../../utils');

const visitor = {
  ObjectExpression(path) {
    // 修改alias
    if (path.parentPath && path.parentPath.node.key && path.parentPath.node.key.name === 'alias') {
      const aliasTemplate = template.expression(`{
        '@': path.resolve(__dirname, 'src'),
        'src': path.resolve(__dirname, 'src'),
        'utils': path.resolve(__dirname, 'src/utils'),
        'vue': 'vue/dist/vue.esm.js'
      }`);
      path.replaceWith(aliasTemplate());
      path.stop();
    }

    // 修改proxyTable
    if (path.parentPath && path.parentPath.node.key && path.parentPath.node.key.name === 'proxy') {
      const config = getOriginConfig();
      const proxy = (config.dev && config.dev.proxyTable) || {}
      const proxyTemplate = template.expression(JSON.stringify(proxy));
      path.replaceWith(proxyTemplate());
      path.stop();
    }
  },

  ObjectMethod(path) {
    // 修改eslint
    if (path.node.key && path.node.key.name === 'webpack') {
      const eslintTemplate = template.expression(`
        config.module.rules = [
          ...config.module.rules.filter(rule => {
            return rule.loader !== 'eslint-loader'
          })
        ]
      `);
      path.get('body').unshiftContainer('body', eslintTemplate());
    }
  }
}

// 处理hsbvue.config.js文件
module.exports = async function() {
  const actions = [];

  if ( !(await exists('hsbvue.config.js')) ) {
    actions.push({
      type: 'add',
      files: 'hsbvue.config.js',
    }, {
      type: 'modify',
      files: 'hsbvue.config.js',
      handler(data) {
        const ast = parse(data);
        traverse(ast, visitor);
        const { code } = generator(ast)
        return code;
      }
    })
  }

  return actions;
}
