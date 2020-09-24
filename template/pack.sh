#!/bin/bash
env=$1
[ -z "$1" ] && env="product"        # 默认生产编译

# 安装依赖
npm install

# 调用打包脚本
if [ $env != 'product' ]
then
    npm run build:${env}
else
    npm run build
fi