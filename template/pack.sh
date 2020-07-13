#!/bin/bash
# 鼓励大家减少自定义模块的增加，把常用模块整合到脚手架中，有利于升级版本维护和模块本身的升级兼容问题
# npm模块质量不高的建议不要采用

# 部署方案######################################################
# deploy：html、静态资源，均部署服务器
# deploy1：html部署服务器，静态资源部署cdn
# deploy2：html、静态资源，均部署cdn

# 脚手架更新步骤######################################################
# cd /data/webroot/front/vue_webpack
# chmod -X *.sh
# git pull
# cnpm i
# rm -rf ../modules/node_modules
# mv node_modules ../modules/
# cp package.json ../modules/node_modules/

# 打包服务器目录结构######################################################
# /data/webroot/front/
#   |-modules/
#       |-node_modules/
#           |-....
#           |-package.json
#           |-relyCounter.txt
#       |-devops_f2e_modules/
#       |-receiving_system_vue_modules/
#
#   |-devops_f2e
#       |-src
#       |-*.sh
#   |-receiving_system_vue
#       |-src
#       |-*.sh
#   |-...

# 服务器配置参数######################################################
dirRoot="/data/webroot/front/"      # 运维预先建立文件夹
dirModules="modules"                # 运维预先建立文件夹
nodeVersion="v10.16.0"              # 固定node版本

# 接收python参数######################################################
# $1 打包环境{test, product}, 默认product, 测试和生产只构建一次

env=$1
[ -z "$1" ] && env="product"        # 默认生产编译
pwd=$(pwd)
appName="${pwd##*/}"                # 当前应用名
standard="no"                       # 是否标准依赖
custom="no"                         # 是否自定义依赖
openPack=0                          # 打包开关
team=""                             # 前缀, 防止应用名重名
day=`date +%Y-%m-%d" "%H:%M:%S`
standardModule=""
customModule=""

deleteFolder() {
	if [ -d ${1} ]
	then
		rm -rf ${1}
	fi
}

createFolder() {
	if [ ! -d ${1} ]
	then
		mkdir ${1}
	fi
}

# 检测命令是否存在
hasCommandByType(){
    if type $1 2>/dev/null; 
    then
        return 1
    else
        return 0
    fi
}

# 记录有多少应用依赖了标准模块
relyCounter() {
    txt=$standardModule/relyCounter.txt
    cat $txt | grep $appName
    if [ $? == 1 ]
    then
        echo [$appName] $day >> $txt
    fi
}

# 获取git组织作为依赖包前缀{plat}
# http://git.xxx.com.cn/plat/vue_webpack.git
# git@git.xxx.com.cn:plat/vue_webpack.git
getAppPrefix() {
    remote=`git remote -v`
    if [[ $remote =~ "://" ]]
    then
        remote=${remote%/*}
        team=${remote##*/}
    else
        remote=${remote%/*}
        team=${remote##*:}
    fi
}

# 安装模块
installNpm() {
    cnpm i
}

# 移动模块
moveNpm() {
    mv node_modules $1
    cp package.json $1/
}

# 设置软连
setLn() {
    ln -s $1 node_modules
}

# 依赖不存在, 安装npm，设置软链接
checkLnNpm() {
    openPack=0
    rm -rf node_modules

    if [ x$2 == xupdate ]
    then
        echo "delete $1 folder"
        deleteFolder $1
    fi

    if [ ! -d $1 ]
    then
        installNpm
        moveNpm $1
    fi
    
    # if [ ! -h node_modules ]
    # then
    #     setLn $1
    # fi
    setLn $1
    openPack=1
}

# 检测文件内容是否相同，0是相同
isFileSame() {
    file1=$1
    file2=$2
    diff $file1 $file2 > /dev/null
    if [ $? == 0 ]
    then
        return 0
    else
        return 1
    fi
}

# 检测npm，node版本
checkVersion() {
    hasCommandByType node
    returnVue=$?
    if [ $returnVue == 0 ]
    then
        echo "请安装node指定版本：${nodeVersion}"
        exit 0
    fi

    currentNodeV=$(node -v)
    if [ $currentNodeV != $nodeVersion ]
    then
        echo "请安装node指定版本：${nodeVersion}"
        exit 0
    fi

    hasCommandByType cnpm
    returnVue=$?
    if [ $returnVue == 0 ]
    then
        echo "请安装cnpm..."
        exit 0
    fi
}

# 检测应用依赖的包是标准还是自定义
checkAppRelyType() {
    isFileSame package.json $1/package.json
    returnVue=$?
    if [ $returnVue == 0 ]
    then
        standard="yes"
        relyCounter
    else
        custom="yes"
    fi
}

# entry
getAppPrefix
standardModule="${dirRoot}${dirModules}/node_modules"
customModule="${dirRoot}${dirModules}/${team}_${appName}_${dirModules}"

# 检测版本
checkVersion
chmod 755 *.sh
checkAppRelyType $standardModule
echo "rely type: $standard, $custom"

# 标准应用依赖
if [ $standard == "yes" ]
then
    checkLnNpm $standardModule
fi

# 自定义应用依赖
# 检测当前应用的package.json文件和modules依赖模块里存放的package.json是否一致，不一致则更新
if [ $custom == "yes" ]
then
    checkLnNpm $customModule
    isFileSame package.json $customModule/package.json
    returnVue=$?
    if [ $returnVue == 1 ]
    then
        echo 'update custom module rely'
        checkLnNpm $customModule update
    fi
fi

if [ $openPack == 1 ]
then
    # 调用打包脚本
    if [ $env != 'product' ]
    then
        npm run build:${env}
    else
        npm run build
    fi
fi