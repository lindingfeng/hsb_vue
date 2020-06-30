const path = require('path')
const os = require('os')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const scriptConfig = require('../../src/config/scriptConfig')
const packageConfig = require('../../package.json')
const { env } = require('./path.config')
const isDev = env === 'dev'
const isRem = scriptConfig.px2rem

// 获取指定目录下的文件夹名字
exports.getFolderName = (p) => {
    let names = []
    const files = fs.readdirSync(p)
    files.forEach((item, index) => {
        let stat = fs.lstatSync(p + "/" + item)
        if (stat.isDirectory() === true) {
            names.push(item)
        }
    })
    return names
}

exports.getIPAdress = () => {
    let interFaces = os.networkInterfaces()
    let WLAN = interFaces.WLAN
    let localIp = '127.0.0.1'

    if (!WLAN) {
        for (let i in interFaces) {
            let arr = interFaces[i] || []
            if (!arr.length) continue
            for (let j = 0; j < arr.length; j++) {
                if (arr[j]['family'] === 'IPv4' && arr[j].address !== localIp) {
                    return arr[j].address
                }
            }
        }
    }

    if (WLAN.length) {
        for (let i = 0; i < WLAN.length; i++) {
            let alias = WLAN[i]
            if (alias.family === 'IPv4' && alias.address !== localIp && !alias.internal) {
                return alias.address
            }
        }
    }

    return localIp
}

exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')
    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}

exports.cssLoaders = (options = {}) => {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            minimize: isDev === false,
            importLoaders: 1
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap,

            // node_modules
            modules: true
        }
    }

    const px2remLoader = {
        loader: 'px2rem-loader',
        options: {
            remUni: 75,
            remPrecision: 8
        }
    }

    // generate loader string to be used with extract text plugin
    let generateLoaders = (loader, loaderOptions) => {
        const loaders = [cssLoader]
        if (isRem) loaders.push(px2remLoader)
        if (options.usePostCSS) loaders.push(postcssLoader)

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = (options) => {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}