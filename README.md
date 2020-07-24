# 单页、多页面脚手架

## 一、目录

* hsbvue
  * [使用说明](docs/USER.md)
  * [旧项目迁移](docs/MIGRATE.md)
  * [cli开发指南](docs/DEVELOPER.md)（开发本脚手架）



## 二、环境依赖

> `node` >= 10.16.0
>
> `npm` >= 6.9.0
>
> `git` >= 2.13.2



## 三、安装方式

1. 全局cli（推荐）
```bash
# 安装cli
npm i -g git+http://gitlab.huishoubao.com/web_team/public/hsb_vue.git --registry=https://registry.npm.taobao.org
# 现在可以使用全局命令`hsbvue`
hsbvue create my-app
# 进入工作目录
cd my-app
```

 

2. npx方式安装
```bash
npx git+http://gitlab.huishoubao.com/web_team/public/hsb_vue.git create my-app
# 进入工作目录
cd my-app
```



## 四、开始开发

```bash
npm run dev # 启动开发模式
npm run build # 编译
```



## 五、更新/升级

如要更新/升级到最新版本的@hsb/vue，也可通过全局cli命令和npx两种方式

1. 全局cli（前提：已安装cli）
```bash
# 进入工作目录
cd my-app
hsbvue upgrade
```

 

2. npx方式
```bash
# 进入工作目录
cd my-app
npx git+http://gitlab.huishoubao.com/web_team/public/hsb_vue.git upgrade
```



## 六、常见问题

1. 如何获得相关指令帮助？

```bash
hsbvue --help # 获得简要帮助
hsbvue dev --help # 获得dev指令帮助
hsbvue upgrade --help # 获得upgrade指令帮助
...
```

 

2. 如何修改dev端口号？

可修改package.json文件 `scripts > dev` 为下列值。也可以通过修改`hsbvue.config.js`文件（详见[使用说明](docs/USER.md)）覆盖默认webpack配置。
```bash
hsbvue dev -p 8080 # 或 --port 8080
```

 

3. 如何升级到指定版本？

```bash
hsbvue upgrade -t v1.0.0 # 版本号既仓库tag
```



4. 使用yarn时安装/升级失败如何处理？

这可能是yarn缓存了旧的版本导致，可尝试清理yarn的缓存后再进行操作。
```bash
yarn cache clean
```



5. 安装时报没有权限（Access denied）？报仓库不存在（The project you were looking for could not be found）？

可尝试带账号安装(Basic Auth)。具体为修改http地址为 `http://[账号]@url` ，以账号`bruce`为例：

```bash
# 安装cli
npm i -g git+http://bruce@gitlab.huishoubao.com/web_team/public/hsb_vue.git --registry=https://registry.npm.taobao.org
# npx使用
npx git+http://bruce@gitlab.huishoubao.com/web_team/public/hsb_vue.git create my-app
```




