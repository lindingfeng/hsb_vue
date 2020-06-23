# 单页、多页面脚手架

## 安装方式
1. 全局cli（推荐）
```bash
# 安装cli
npm i -g git+http://git.huishoubao.com.cn/liuyunlong/hsb_vue.git
# 现在可以使用全局命令`hsbvue`
hsbvue create my-app
# 进入工作目录
cd my-app
```

2. npx方式安装
```bash
npx git+http://git.huishoubao.com.cn/liuyunlong/hsb_vue.git create my-app
# 进入工作目录
cd my-app
```


## 开始开发
```bash
npm run dev # 启动开发模式
npm run build # 编译
```



## 更新/升级

如要更新/升级到最新版本的脚手架，也可通过全局cli命令和npx两种方式

1. 全局cli（前提：已安装cli）

   ```bash
   # 进入工作目录
   cd my-app
   hsbvue update
   ```

2. npx方式

   ```bash
   # 进入工作目录
   cd my-app
   npx git+ssh://git@git.huishoubao.com.cn:liuyunlong/hsb_vue.git update
   ```
