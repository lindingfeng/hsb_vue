const { resolve } = require('path');
const chalk = require('chalk');
const R = require('ramda');
const prompts = require('./prompts');
const { sortByKey } = require('./utils');
const pkg = require('./package');

const templateDir = resolve(__dirname, '../template');

module.exports = {
    prompts,
    actions() {
        const generator = this;
        const actions = [{
                type: 'add',
                // Copy and transform all files in `template` folder into output directory
                files: '**',
                templateDir,
            },
            {
                type: 'move',
                patterns: {
                    _babelrc: '.babelrc',
                    _editorconfig: '.editorconfig',
                    _eslintignore: '.eslintignore',
                    '_eslintrc.js': '.eslintrc.js',
                    '_eslintrcbase.js': '.eslintrcbase.js',
                    _gitignore: '.gitignore',
                    '_package.json': 'package.json',
                },
                templateDir
            },
            {
                type: 'modify',
                files: 'package.json',
                handler(data) {
                    const package = R.mergeDeepLeft(data, pkg.load(generator));
                    package.dependencies = sortByKey(package.dependencies || {});
                    package.devDependencies = sortByKey(package.devDependencies || {});
                    return package;
                }
            }
        ];
        return actions;
    },

    async completed() {
        this.gitInit();
        // await this.npmInstall();
        console.log(chalk `{cyan ✨ 项目生成成功！}`)
    }
}