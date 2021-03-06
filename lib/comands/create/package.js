const path = require('path');
const { merge, getRepositoryUrl } = require('../../utils');
const mainPkg = require('../../../package.json');

module.exports = {
    requireFile(filename) {
        try {
            return require(filename)
        } catch (error) {
            return {}
        }
    },
    requireJSON(filename) {
        const file = path.resolve(__dirname, `../../../frameworks/${filename}/package.json`);
        return JSON.parse(JSON.stringify(this.requireFile(file)));
    },
    load(generator) {
        const uiPkg = this.requireJSON(generator.answers.ui);
        const repositoryUrl = getRepositoryUrl(mainPkg);
        const hsbPkg = {
            dependencies: {
                [mainPkg.name]: `${repositoryUrl}#v${mainPkg.version}`
            },
        }
        const pkg = merge(hsbPkg, uiPkg);
        return pkg;
    }
};