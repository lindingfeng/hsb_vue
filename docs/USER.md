# hsbvue 使用说明

本脚手架因为并未发布至npm仓库，故只能通过git地址方式安装使用。目前支持`npx`及`cli`两种方式使用。



## 使用方式

### cli方式（推荐）

如采用 cli方式，需要先安装全局cli 

```bash
# 安装cli
npm i -g git+http://git.huishoubao.com.cn/liuyunlong/hsb_vue.git
# 现在可以使用全局命令`hsbvue`
hsbvue <指令> [参数]
```

### npx 方式

如采用npx方式（此方式因需要先下载git仓库，速度较慢）

```bash
npx {git地址} <指令> [参数] # 例：npx git+http://git.huishoubao.com.cn/liuyunlong/hsb_vue.git create my-app
```



## hsbvue指令

1. 创建新项目
```bash
hsbvue create my-app
```

   

2. 启动开发模式
```bash
# 默认配置启动
hsbvue dev
# 修改域名及端口号
hsbvue dev -h http://dev.huishoubao.com -p 8080
```

   

3. 打包生产环境代码
```bash
hsbvue build
```

   

4. 升级脚手架
```bash
# 升级到最新版
hsbvue upgrade
# 升级到指定版本
hsbvue upgrade -t v1.0.0 # 版本号既仓库tag
```

   

## 配置文件

为了便于扩展，在项目根目录下会生成 `hsbvue.config.js` 文件，可在此文件里进行自定义配置、webpack扩展等。

```javascript
// hsbvue.config.js
module.exports = {
  mode: 'spa', // 页面模式：spa - 单页模式，universal - 多页面模式
  webpack(config, { dev }) {
    // 自定义webpack配置，修改config将会覆盖默认配置
    // dev 在开发模式时为 true
    // 例如修改devServer
    config.devServer = {
      ...config.devServer,
      host: 'http://dev.huishoubao.com',
      port: 8080
    }
    return config;
  }
}
```

