# <%= name %>
<%= description %>

## 安装依赖
```bash
npm i
```



## 开发

```bash
npm run dev
```



## 编译打包

```bash
npm run build
```



## 目录文件说明

- 【require】必须文件/文件夹，不同页面模式下可能会没有
- 【SPA】单页模式下才会有的文件/文件夹
- 【UNIVERSAL】多页模式下才会有的文件/文件夹

```JavaScript
|-dist                     打包后的文件夹
|-src                      源代码
    |-common              【require】存放公用资源
    |-config              【require】运行应用依赖的配置{域名，秘钥}，方便维护迁移
    |-entry               【require】【UNIVERSAL】多页面入口
    |-plugins              插件目录，第三方包（如ui框架）可在此处理
    |-router              【require】【SPA】路由
    |-store                store
    |-utils                自定义的应用工具方法，可继承自`@hsb/vue/utils`
    |-views               【require】【SPA】逻辑视图
    |-App.vue             【require】【SPA】
    |-main.js             【require】【SPA】应用入口
|-static                   静态目录，存放不需要打包的css，js，img，视频，音频等等
|-.babelrc                 编译es6的babel配置
|-.editorconfig            编辑器配置文件
|-.eslintignore            eslint过滤文件夹
|-.eslintrc                eslint配置文件
|-.eslintrcbase            eslint基础规则
|-.gitignore
|-.stylelintrc            【require】stylelint配置文件
|-hsbvue.config           【require】hsbvue配置文件，可修改脚手架相关配置（如webpack配置）
|-index.html              【require】html默认模板
|-pack.sh                 【require】发版系统会调用脚本, 只会调用product脚本，因为目前发版系统实现的是测试和生产同一套代码
|-package.json
|-postcss.config          【require】
```



### 单页应用（SPA）

在使用 `hsbvue` 创建项目时选择 “单页面（SPA）” 即会创建单页应用项目。此时，入口文件为`src/main.js`。



### 多页面（UNIVERSAL）

在使用 `hsbvue` 创建项目时选择 “多页面” 即会创建多页面项目。此时，入口文件为`src/entry/[name]/main.js`。

其中，`src/entry/index/main.js`为首页，即 index.html。

> 以下是示例：
  - index和user是两个页面，他们是独立的，访问方式如同
  - 127.0.0.1/index.html
  - 127.0.0.1/user.html
  - 每个页面必须有main.js入口文件
  - 建议按照以下目录来建立，保持一致

```JavaScript
|-entry
    |-index
        |-router
        |-views
        |-App.vue
        |-main.js【require】
    |-user
        |-router
        |-views
        |-App.vue
        |-main.js【require】
```



## 插件机制

约定在 `src/plugins` 目录处理第三方包。如用`hsbvue`创建项目时选择了第三方ui框架，也将会自动创建该目录，如：

```JavaScript
|-plugins
    |-element-ui.js
```

直接在`main.js`文件导入即可：

```javascript
import '@/plugins/element-ui';
```



## 多环境

目前支持三种环境：`local`、`test`、`product`，分别对应不同指令：

> package指令
>
> - npm run dev     		# 对应local环境
> - npm run build          # 对应product环境
> - npm run build:test  # 对应test环境

如需增加环境，可在package.json里自行配置：

```json
{
    "scripts": {
        "dev": "hsbvue dev",
        "build": "hsbvue build",
        "build:test": "hsbvue build --env=test",
        "build:other": "hsbvue build --env=other"
    }
}
```

如上，增加了一个名为`other`的环境（对应指令 npm run build:other），可通过 `process.env.ENV` 直接读取，也可通过配置文件：

```javascript
import { env } from '@/config/env.config';
console.log(env); // other
```



## 注意事项

- utils大部分继承自 `@hsb/vue/utils` ，建议通用性较强的扩展可提交到 `@hsb/vue` 仓库
- `hsbvue.config.js`中的`mode`将决定webpack以何种方式打包，建议不要随意修改

