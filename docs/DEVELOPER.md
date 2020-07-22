# hsbvue cli 开发指南

该cli基于 [cac.js](https://github.com/cacjs/cac) 和 [sao.js](https://saojs.org/) 开发，项目模板基于原 [vue_webpack](http://git.huishoubao.com.cn/hsb/vue_webpack) 。设计思想是让前端可以用cli命令无痛完成项目创建、更新、升级、打包、部署等。



## 一、开发调试

```bash
# 步骤1，安装cli
npm link              # 临时链接@hsb/vue到全局，相当于 npm install -g @hsb/vue

# 步骤2，cli的使用
hsbvue create my-app  # 使用临时cli创建 my-app

# 步骤3，临时链接到新项目
cd my-app             # 进入my-app
npm install           # 安装依赖
npm link @hsb/vue     # 链接@hsb/vue
npm run dev
```

完成以上步骤后即可在模板和cli之间进行开发调试。

> 注：
>
> - 作为cli时，其命令为`hsbvue`
> - 作为项目依赖时，包名称为`@hsb/vue`





## 二、目录结构说明

```
.
├── config
│   ├── helper.js         # 配置相关的helper
│   ├── webpack.config.js # 基本webpack配置，各环境都会引用
│   ├── webpack.dev.config.js # 开发环境webpack配置，将会启用devServer
│   ├── webpack.production.config.js # 生产环境webpack配置
│   └── ...
│
├── docs                  # 文档目录
├── frameworks            # 第三方包/框架，将会依据create时的不同选择植入项目中
│   ├── element-ui        # element-ui示例
│   │   ├── src           # 将会植入项目的文件
│   │   └── package.json  # 该三方框架package配置
│   └── ...
│
├── lib                   # 第三方包/框架，将会依据create时的不同选择植入项目中
│   ├── commands          # 各种指令处理，如：dev、build
│   ├── cfg.js            # 指令运行时配置整合，主要是整合hsbvue.config.js及webpack配置
│   ├── cli.js            # cli指令统一入口
│   ├── package.js        # 负责处理package.json文件
│   ├── prompts.js        # cli交互提示
│   ├── run.js            # cli指令调度
│   ├── saofile.js        # sao.js配置
│   ├── setup.js          # cli指令启动设置（不含create指令）
│   └── utils.js          # cli相关工具函数
|
├── template              # 项目模板，create项目时将以此做模板
├── utils                 # 提供给项目继承使用的通用工具函数（注意和cli工具函数区分）
|
└── package.json
```



## 三、模板开发

模板位于`template`目录，用于`hsbvue create`指令。创建新项目时将会复制此目录文件，并进行一些必要处理。

> 模板目录结构

 ```
 .
 ├── template
 │   ├── src               # 源码文件目录
 │   ├── static            # 不需要打包的静态资源
 │   ├── _babelrc          # 即.babelrc文件
 │   ├── _eslintrc.js      # 即.eslintrc文件
 │   ├── _gitignore        # 即.gitignore文件
 │   ├── _package.json     # 即package.json
 │   ├── hsbvue.config.js  # hsbvue脚手架相关配置
 │   ├── index.html        # 默认html模板（移动端，PC端项目会自动移除）
 │   ├── pc_index.html     # pc端html模板（mobile端项目会自动移除）
 │   └── ...
 ```



> 开发说明

1. 模板支持两种变量

  - `<%= name %>`     此为cli变量，仅在创建项目时，由`sao.js`写入。相关变量可在`saofile.js`文件中的`templateData`定义。
  - `${name}`        此为webpack变量，在 编译/运行时，由webpack写入（目前仅在html模板里有用）



2. 模板中`_`开头的文件，是由于linux系统下可能会忽略拷贝`.`开头的隐藏文件。所以，如果模板中含有此类文件，需改写为`_`开头，并在`saofile.js`里做相应配置。



## 四、插件开发

第三方包/框架，都存放于`frameworks`目录，一个典型的插件结构如：

```
├── frameworks
│   └── element-ui        # element-ui示例
│       ├── src           # 将会植入项目的文件
│       │   ├── plugins   # 将会被拷贝到项目 src/plugins 目录
│       │   └── ...       # 将会被拷贝到项目 src 目录下
│       │
│       └── package.json  # 该三方框架package配置
```

插件对应`package.json` 配置如下例所示，仅需配置自身项即可，最终将会被整合进项目package.json文件相应字段。

```json
{
    "dependencies": {
        "element-ui": "^2.13.2"
    }
}
```



## 五、版本发布

1. 自动发版

```bash
npm run release
```

   


2. 手动发版

> 发布新版本时，必须打tag，并修改`package.json`的`version`字段
>
> tag和version必须一一对应
>
> 因npm规范约束，`version`字段需去掉开头的 `v`

例如，发 `v1.0.2` 版，则 `version` = `1.0.2`，`tag` = `v1.0.2`
```json
{
    "name": "@hsb/vue",
    "version": "1.0.2"
}
```

```bash
$ git tag v1.0.2
$ git push origin v1.0.2
```
