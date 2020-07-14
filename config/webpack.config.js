const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

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
  const { dev, env, mode, head, extra } = options;
  const sourceMapEnabled = dev;
  const relyOnLink = helper.createRelyOn('link', head.link || []);
  const relyOnScript = helper.createRelyOn('script', head.script || []);
  const cssLoaders = helper.cssLoaders({
    dev,
    sourceMap: sourceMapEnabled,
    usePx2rem: extra.usePx2rem,
    usePostCSS: extra.usePostCSS,
    useExtractCSS: extra.useExtractCSS,
  });

  const getEntryAndHtml = (mode) => {
    if (mode === 'universal') {
      const names = helper.getFolderName(path.join(process.cwd(), 'src/entry'))
      const entry = {}
      const htmlPlugin = []
      names.forEach(name => {
        entry[name] = `./src/entry/${name}/main.js`
        htmlPlugin.push(new HtmlWebpackPlugin({
          template: path.join(process.cwd(), `index.html`),
          filename: `${name}.html`,
          meta: head.meta,
          templateParameters: {
            title: head.title,
            relyOnLink,
            relyOnScript,
          },
          chunks: [name]
        }))
      })
      return {
        entry,
        htmlPlugin
      }
    } else {
      return {
        entry: './src/main.js',
        htmlPlugin: [new HtmlWebpackPlugin({
          template: path.join(process.cwd(), 'index.html'),
          meta: head.meta,
          templateParameters: {
            title: head.title,
            relyOnLink,
            relyOnScript,
          }
        })]
      }
    }
  }

  const entryAndHtml = getEntryAndHtml(mode)

  const config =  {
    mode: process.env.NODE_ENV || 'production',
    entry: entryAndHtml.entry,
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: dev ? 'js/[name].js' : 'js/[name].[chunkhash].js'
    },

    module: {
      noParse: [/static\/([\s\S]*.(js|css))/],
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: { fix: true }
        },
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
      new webpack.DefinePlugin({
        'process.env.ENV': JSON.stringify(env),
      }),
      new StyleLintPlugin({
        files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
        fix: true,
      }),
      ...entryAndHtml.htmlPlugin,
    ],

    optimization: {
      splitChunks: {
        chunks: "all",
        name: true,
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            minChunks: 1,
            priority: 10
          },
        }
      }
    }
  }

  if (extra.useExtractCSS && !dev) {
    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'style.css'
    }));
  }

  return config;
}
