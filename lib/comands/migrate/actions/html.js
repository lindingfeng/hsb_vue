const path = require('path');
const { exists } = require('../helper');

// 处理index.html
module.exports = async function() {
  const actions = [];
  if ( !(await exists('index.html')) ) {
    const hasOriginHtml = await exists('scripts/templates/html/index.html');
    if (hasOriginHtml) {
      actions.push({
        type: 'add',
        files: 'index.html',
        templateDir: path.resolve(process.cwd(), 'scripts/templates/html'),
      });
      actions.push({
        type: 'modify',
        files: 'index.html',
        handler(data) {
          data = data.replace(/\{(title|relyOnLink|relyOnScript)\}/g, '<%=$1%>');
          data = data.replace(/\{(\w+)\}/g, '');
          return data
        }
      });
    } else {
      actions.push({
        type: 'add',
        files: 'index.html',
      });
    }
  }
  return actions;
}
