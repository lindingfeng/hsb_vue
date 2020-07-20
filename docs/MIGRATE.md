# 旧项目迁移

## 一、迁移

进入项目根目录后运行以下命令即可完成迁移：

```bash
hsbvue migrate
```

> 迁移过程中，会修改如下所列文件。如需存档，请自行于迁移开始前做好备份。
>
> > package.json
> >
> > README.md
> >
> > index.html
> >
> > pack.sh
> >
> > .babelrc
> >
> > .stylelintrc



# 二、使用

迁移完成后将会新增三条命令

```bash
npm run hsb:dev        # 开发模式
npm run hsb:build      # 打包生产环境代码
npm run hsb:build:test # 打包测试环境代码
```

> 加 `hsb` 前缀是为了避免与旧有命令冲突。如确定旧有命令不再使用，可自行于 `package.json` 文件调整命令。



## 三、常见问题

1. 使用yarn时，迁移完成后提示缺失模块如何处理？

   重新运行 `yarn` 或 `yarn install` 重新安装模块即可