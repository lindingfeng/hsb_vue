const path = require('path');
const HappyPack = require('happypack');
const os = require('os');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const helper = require('./helper');

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
  const { dev, head, extra } = options;
  const sourceMapEnabled = dev;
  const relyOnLink = helper.createRelyOn('link', head.link || []);
  const relyOnScript = helper.createRelyOn('script', head.link || []);
  const cssLoaders = helper.cssLoaders({
    dev,
    sourceMap: sourceMapEnabled,
    usePx2rem: extra.usePx2rem,
    usePostCSS: extra.usePostCSS,
    useExtractCSS: extra.useExtractCSS,
  });

  const config =  {
    mode: process.env.NODE_ENV || 'production',
    entry: './src/main.js',
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: 'bundle.js'
    },
    module: {
      noParse: [/static\/([\s\S]*.(js|css))/],
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            cssSourceMap: sourceMapEnabled,
            cacheBusting: dev,
            transformToRequire: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }
          }
        },
        {
          test: /\.js$/,
          loader: dev ? "babel-loader" : 'happypack/loader?id=happy-vue-js'
        },
        {
          test: /\.css$/,
          use: cssLoaders.css,
        },
        {
          test: /\.scss$/,
          use: cssLoaders.scss,
        },
        {
          test: /\.sass$/,
          use: cssLoaders.sass,
        },
        {
          test: /\.less$/,
          use: cssLoaders.less,
        },
        {
          test: /\.styl(us)?$/,
          use: cssLoaders.stylus,
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: "file-loader",
              query: {
                name: "img/[name].[hash].[ext]"
              },
            },
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: [
      createHappyPlugin('happy-babel-js', ['babel-loader?cacheDirectory=true']),
      createHappyPlugin('happy-vue-js', ['babel-loader?cacheDirectory=true']),
      new VueLoaderPlugin(),
      new copyWebpackPlugin({
        patterns: [
          {
              from:path.join(process.cwd(), 'static'),// 打包的静态资源目录地址
              to:'./' // 打包到dist下面的static
          },
        ]
      }),
      new HtmlWebpackPlugin({
        title: head.title,
        template: path.join(process.cwd(), 'index.html'),
        meta: head.meta,
        templateParameters: {
          relyOnLink,
          relyOnScript,
        }
      }),
    ],
  }

  if (extra.useExtractCSS && !dev) {
    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'style.css'
    }));
  }

  return config;
}
