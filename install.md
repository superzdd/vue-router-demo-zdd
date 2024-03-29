# 项目安装

再次说明，这个项目的重点其实是[笔记链接](https://github.com/superzdd/vue-router-demo-zdd/blob/main/vue-router-note.md)

后续内容需要下载代码并运行，无此需求的小伙伴直接阅读文档即可。

## 本机环境

考虑到这个项目完成后不会更新，可能下次运行时环境已经变化很大，记录两个最核心的组件版本

- node 20.10.0
- vite 5.0.8

当今后`node`版本变化太大时，推荐用`nvm`进行`node`的版本切换，`nvm`的使用方法需参考：
[如何在 macOS 上安装 NVM](https://juejin.cn/post/7083026831263137800)，其中还涉及到`macos`环境以及`brew`，内容实在太多，这里只能按下不表

## 项目构建

第一次成功运行后，就不需要每次都检查环境了，直接`dev`即可

```bash
npm install # 第一次安装时需要运行，以后就不用再执行了
npm run dev
```

### 安装`vite`

本项目已经用`vite`生成完，下面的命令仅对有兴趣通过`vite`生成新项目的小伙伴。终端命令如下：

```bash
npm create vite@latest vite-travel-app-zdd
✔ Select a framework: › Vue
✔ Select a variant: › JavaScript
```

`vite-travel-app-zdd`仅是一个项目名，切换成你自己的项目名即可

### 问题排查

在命令行中运行`npm install`即可安装，如果你碰到问题，尝试通过下面几种方式解决:

1. 缺少 vite，尝试在项目路径中安装 vite

```
npm i vite -D
```

2. 环境权限不足,给你的代码文件夹提供读写执行权限

```bash
sudo chmod -R 777 /your/dev/path/
```

上方的路径`/your/dev/path/`请修改成你自己电脑本地的路径，比如按照我本机的配置，应该改为:

```bash
sudo chmod -R 777 /Users/zhangchenhai/dev/
```

3. 清除 npm 缓存

```bash
sudo npm cache clean -f
```

## 其他

### vue-router 的安装

使用 vite 新建项目后，安装 vue-router

```bash
npm i vue-router@4 --save
```

### alias 别名

需要分别在`vite.config.js`和`jsconfig.json`，配置`@`的路径，方便后续开发使用

#### 根目录 vite.config.js 文件

```js
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
```

随着 vite 的版本升级，这个配置的写法是改过的，所以和视频中的不一样了。
详见：[`Vue3 - Vite` project alias src to @ not working](https://stackoverflow.com/questions/66043612/vue3-vite-project-alias-src-to-not-working)

#### 根目录创建 jsconfig.json 文件

这个文件 vite 不会创建，需要我们手工创建
这个文件的作用是让`vscode`能更智能得识别我们的项目环境

```js
{
  "include": [
    "./src/**/*"
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    }
  }
}
```
