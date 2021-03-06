const fs = require('fs')
const sass = require("sass");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 创建额外依赖{script, link}
exports.createRelyOn = (type, arr) => {
    if (!arr.length) return ''

    const data = arr.map(attr => {
        let attributes = ''
        for (let j in attr) {
            attributes += encodeURIComponent(j) + '="' + attr[j] + '" '
        }
        if (type === 'script') {
            return `<script ${attributes}></script>`
        }

        if (type === 'link') {
            return `<link ${attributes}>`
        }
    });

    return data.join('')
}

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

exports.cssLoaders = (options = {}) => {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            importLoaders: 1
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
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
        if (options.usePx2rem) loaders.push(px2remLoader)
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
        if (options.useExtractCSS && !options.dev) {
            loaders.unshift(MiniCssExtractPlugin.loader)
        }
        return ['vue-style-loader'].concat(loaders)
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {
            indentedSyntax: true,
            implementation: sass
        }),
        scss: generateLoaders('sass', {
            implementation: sass
        }),
    }
}
