const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/index.js',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'bundle.js'
  }
};