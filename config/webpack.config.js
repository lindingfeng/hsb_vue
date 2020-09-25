const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
  const { dev, env, mode, head, extra, analyzer, workspace } = options;
  const base = workspace ? `packages/${workspace}/` : '';
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
      const names = helper.getFolderName(path.join(process.cwd(), `${base}src/entry`))
      const entry = {}
      const htmlPlugin = []
      names.forEach(name => {
        entry[name] = `./${base}src/entry/${name}/main.js`
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
        entry: `./${base}src/main.js`,
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
      filename: dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      publicPath: '/'
    },

    module: {
      noParse: [/static\/([\s\S]*.(js|css))/],
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          use: [
            'cache-loader',
            {
              loader: 'eslint-loader',
              options: {
                exclude: /node_modules/,
                fix: true,
              }
            }
          ],
          include: [path.resolve(process.cwd(), 'src'), path.resolve(process.cwd(), 'packages')],
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
          },
        },
        {
          test: /\.js$/,
          // loader: dev ? "babel-loader?cacheDirectory" : 'happypack/loader?id=js'
          use: ['cache-loader', 'happypack/loader?id=js'],
          exclude: /static/
        },
        {
          test: /\.css$/,
          use: cssLoaders.css,
          exclude: /static/
        },
        {
          test: /\.scss$/,
          use: ['cache-loader', ...cssLoaders.scss],
        },
        {
          test: /\.sass$/,
          use: ['cache-loader', ...cssLoaders.sass],
        },
        {
          test: /\.less$/,
          use: ['cache-loader', ...cssLoaders.less],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "img/[name].[hash].[ext]",
                esModule: false,
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

    resolve: {
      extensions: ['.js', '.vue']
    },

    plugins: [
      createHappyPlugin('js', ['babel-loader?cacheDirectory=true']),
      new VueLoaderPlugin(),
      new copyWebpackPlugin({
        patterns: [
          {
              from:path.join(process.cwd(), 'public'),
              to:'./',
              noErrorOnMissing: true,
          },
          {
              from:path.join(process.cwd(), 'static'),
              to:'./static',
              noErrorOnMissing: true,
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
          dll: {
            name: 'dll',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            priority: 20
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            minChunks: 2, // 引用两次及以上的依赖才会被抽离
            priority: 10
          },
        }
      }
    }
  }

  if (extra.useExtractCSS && !dev) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    config.plugins.push(new MiniCssExtractPlugin({
      filename: dev ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: dev ? 'css/[id].css' : 'css/[id].[hash].css',
    }));
  }

  if (analyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}
