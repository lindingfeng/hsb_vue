const { resolve, join } = require('path');
const chalk = require('chalk');
const prompts = require('./prompts');
const { merge, sortByKey } = require('./utils');
const pkg = require('./package');

const templateDir = resolve(__dirname, '../template');
const frameworksDir = resolve(__dirname, '../frameworks');

module.exports = {
    prompts,
    templateData () {
        const uiPlugin = this.answers.ui !== 'none' ? `import '@/plugins/${this.answers.ui}'` : '';
        return {
            uiPlugin,
            outFolder: this.outFolder,
        }
    },
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
                    const package = merge(data, pkg.load(generator));
                    package.dependencies = sortByKey(package.dependencies || {});
                    package.devDependencies = sortByKey(package.devDependencies || {});
                    return package;
                }
            },
            {
                type: 'modify',
                files: '*index.html',
                handler(data) {
                    data = data.replace(/\$\{([^}]+)\}/g, '<%=$1%>');
                    return data;
                }
            }
        ];
        if (this.answers.ui !== 'none') {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: join(frameworksDir, this.answers.ui),
                filters: {
                    'package.json': false,
                }
            });
        }
        if (this.answers.device === 'mobile') {
            actions.push({
                type: 'remove',
                files: 'pc_index.html',
            });
        } else if (this.answers.device === 'pc') {
            actions.push({
                type: 'remove',
                files: 'index.html',
            });
            actions.push({
                type: 'move',
                patterns: {
                    'pc_index.html': 'index.html',
                },
                templateDir
            });
        }
        return actions;
    },

    async completed() {
        this.gitInit();
        if (this.answers.npmInstall === 'yes') {
            await this.npmInstall();
        }
        console.log(chalk `{cyan ✨ 项目生成成功！}`);
    }
}