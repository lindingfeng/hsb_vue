// const helper = require('./helper');

const vueLoaderConfig = ({ dev }) => {
    const isDev = dev;
    const sourceMapEnabled = isDev
    const cacheBusting = isDev

    return {
        // loaders: helper.cssLoaders({
        //     sourceMap: sourceMapEnabled,
        //     extract: !isDev,
        //     js: isDev ? "babel-loader" : 'happypack/loader?id=happy-vue-js',
        // }),
        cssSourceMap: sourceMapEnabled,
        cacheBusting: cacheBusting,
        transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        }
    }
}

module.exports = vueLoaderConfig
