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