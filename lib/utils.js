const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const commandExistsSync = require('command-exists').sync;

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

// 交互命令行 (Yes/No)
const quiz = (question, defaultAnswer = 'y') => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const options = defaultAnswer === 'y' ? '(Y/n)' : '(y/N)';

        rl.question(`${question} ${options} `, (a) => {
            const answer = (a || defaultAnswer).toLocaleLowerCase();
            rl.close();
            resolve(answer === 'y');
        });
    });
}

// 检查是否存在yarn
const checkYarn = () => {
    const yarnFile = path.join(process.cwd(), 'yarn.lock');
    const fileExists = fs.existsSync(yarnFile)
    if (!fileExists) return false;
    const cmdExists = commandExistsSync('yarn');
    return cmdExists;
}

// 调用系统命令
const exec = (cmd, args = []) => {
    return new Promise((resolve, reject) => {
        const x = spawn(cmd, args);
        x.stdout.on('data', (data) => {
            console.log(String(data));
        });
        x.on('close', (code) => {
            resolve(code === 0);
        })
        x.on('error', (err) => {
            reject(err);
        })
    })
}

module.exports = {
    isObject,
    merge,
    sortByKey,
    requireLocal,
    quiz,
    checkYarn,
    exec
}