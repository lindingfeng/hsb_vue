const { requireLocal } = require('../../utils');
const { getOriginConfig } = require('./helper');

// 处理templateData
module.exports = function() {
  const config = getOriginConfig();
  const pkg = requireLocal('./package.json');
  const extra = ['extract'];

  if (config.px2rem) {
    extra.push('px2rem');
  }

  return {
    name: config.product ? config.product.title : pkg.name,
    description: pkg.description,
    mode: config.multiple ? 'universal' : 'spa',
    device: 'mobile',
    ui: 'none',
    extra,
  };
}
