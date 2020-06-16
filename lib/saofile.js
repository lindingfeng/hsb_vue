const { resolve } = require('path');
const chalk = require('chalk');
const prompts = require('./prompts');

const templateDir = resolve(__dirname, '../template');

module.exports = {
    prompts,
    actions: [{
            type: 'add',
            // Copy and transform all files in `template` folder into output directory
            files: '**',
            templateDir,
        },
        {
            type: 'move',
            patterns: {
                _gitignore: '.gitignore',
                '_package.json': 'package.json',
            },
            templateDir
        }
    ],
    async completed() {
        this.gitInit();
        await this.npmInstall();
        console.log(chalk `{cyan ✨ 项目生成成功！}`)
    }
}