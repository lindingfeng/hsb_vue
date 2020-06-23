const path = require('path');

const isObject = (value) => {
    return !!value &&
    typeof value === 'object' &&
    typeof value.getMonth !== 'function' &&
    !Array.isArray(value)
}

const merge = (...sources) => {
    const [target, ...rest] = sources
  
    for (const object of rest) {
        for (const key in object) {
            const targetValue = target[key]
            const sourceValue = object[key]
            const isMergable = isObject(targetValue) && isObject(sourceValue)
            target[key] = isMergable ? merge({}, targetValue, sourceValue) : sourceValue
        }
    }
  
    return target
}

const sortByKey = (unsortedObject) => {
    const sortedObject = {}
    Object.keys(unsortedObject).sort().forEach((key) => {
        sortedObject[key] = unsortedObject[key]
    })
    return sortedObject
}

// 加载本地模块
const requireLocal = (x) => {
    let modulePath = '';
    if (x.startsWith('.') || x.startsWith('/')) {
        modulePath = path.join(process.cwd(), x);
    } else {
        modulePath = path.join(process.cwd(), 'node_modules', x);
    }
    return require(modulePath);
}

module.exports = {
    isObject,
    merge,
    sortByKey,
    requireLocal,
}