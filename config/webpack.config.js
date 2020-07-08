const path = require('path');
const HappyPack = require('happypack');
const os = require('os');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const helper = require('./helper');
const vueLoaderConfig = require('./vue-loader-conf');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const createHappyPlugin = (id, loaders) => {
  return new HappyPack({
      id: id,
      loaders: loaders,
      threadPool: happyThreadPool,
      verbose: false
  })
}

module.exports = (options) => {
  const { dev, head } = options;
  const relyOnLink = helper.createRelyOn('link', head.link || []);

  return {
    mode: process.env.NODE_ENV || 'production',
    entry: './src/main.js',
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: 'bundle.js'
    },
    module: {
      // noParse: /static\/([\s\S]*.(js|css))/,
      rules: [
        {
          test: /\.vue$/,
          //exclude: exclude,
          //include: [resolve('src')],
          loader: 'vue-loader',
          options: vueLoaderConfig({ dev })
        },
      ]
    },
    plugins: [
      createHappyPlugin('happy-babel-js', ['babel-loader?cacheDirectory=true']),
      createHappyPlugin('happy-vue-js', ['babel-loader?cacheDirectory=true']),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: head.title,
        template: path.join(process.cwd(), 'index.html'),
        meta: head.meta,
        templateParameters: {
          relyOnLink,
        }
      }),
    ],
  }
}
