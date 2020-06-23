const path = require('path');
const { merge } = require('./utils');
const mainPkg = require('../package.json');

module.exports = {
    requireFile(filename) {
        try {
            return require(filename)
        } catch (error) {
            return {}
        }
    },
    requireJSON(filename) {
        const file = path.resolve(`./frameworks/${filename}/package.json`);
        return JSON.parse(JSON.stringify(this.requireFile(file)))
    },
    load(generator) {
        const uiPkg = this.requireJSON(generator.answers.ui);
        const hsbPkg = {
            dependencies: {
                hsbvue: mainPkg.repository.url
            },
        }
        const pkg = merge(hsbPkg, uiPkg);
        return pkg;
    }
};