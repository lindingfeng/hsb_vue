const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);

// 处理.babelrc
module.exports = async function(templateDir) {

  const babelrcFile = path.resolve(templateDir, '_babelrc');
  let babelrc = await read(babelrcFile, {encoding: 'utf-8'});
  babelrc = JSON.parse(babelrc);

  const actions = [{
    type: 'modify',
    files: '.babelrc',
    handler(data) {
      let opt = {};
      try {
        opt = JSON.parse(data);
      } catch (err) {}

      Object.entries(babelrc).forEach(([key, val]) => {
        if (key === 'presets') {
          opt[key] = val;
        } else if (Array.isArray(val)) {
          const map = new Map();
          const tmp = [ ...val, ...opt[key] ];
          tmp.forEach(it => {
            const name = Array.isArray(it) ? it[0] : it;
            if (!map.has(name)) map.set(name, it);
          });
          opt[key] = Array.from(map.values());
        } else if (typeof val === 'object') {
          opt[key] = {
            ...opt[key],
            ...val,
          };
        } else {
          opt[key] = val;
        }
      });

      return JSON.stringify(opt, null, 2);
    }
  }];

  return actions;
}
