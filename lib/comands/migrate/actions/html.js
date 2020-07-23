const path = require('path');
const { exists } = require('../helper');

// 处理index.html
module.exports = async function() {
  const actions = [];
  if ( !(await exists('index.html')) ) {
    const htmls = ['public/index.html', 'scripts/templates/html/index.html'];
    let htmlTemplate
    for (let i in htmls) {
      const has = await exists(htmls[i]);
      if (has) {
        htmlTemplate = htmls[i];
        break;
      }
    }
    if (htmlTemplate) {
      actions.push({
        type: 'add',
        files: 'index.html',
        templateDir: path.resolve(process.cwd(), htmlTemplate.replace(/index\.html$/, '')),
      });
    } else {
      actions.push({
        type: 'add',
        files: 'index.html',
      });
    }
    actions.push({
      type: 'modify',
      files: 'index.html',
      handler(data) {
        data = data.replace(/\$?\{(title|relyOnLink|relyOnScript)\}/g, '<%=$1%>');
        data = data.replace(/\{(\w+)\}/g, '');
        return data
      }
    });
  }
  return actions;
}
