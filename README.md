# 三年级上册闯关练习

一个可离线双击打开的静态网页小游戏，覆盖语文（部编版）、数学（人教版）、英语（PEP）三年级上册，共 20 关。先讲知识点再答题，按答题速度给 1–3 星，错题会换同知识点的新题补做。

## 本地打开

1. 解压后保持 `index.html`、`assets/`、`data/` 在同一目录。
2. 双击 `index.html`，用 Chrome、Edge 或 Safari 打开即可，不需要安装、联网或启动服务器。
3. 首次进入先输入或选择玩家名字；星星、通关进度和错题记录按名字保存在本机浏览器里。
4. 首页右下角可以“切换玩家”，同一台设备支持多个玩家分别记录。

> 进度保存在浏览器的 localStorage 中，清除浏览器数据会一并清除；换设备或换浏览器不会自动同步。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库。
2. 把本目录中的全部内容上传到仓库根目录，确保 `index.html` 在根目录（不要多套一层文件夹）。
3. 打开仓库 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，保存。
5. 等待一两分钟后，访问 `https://<你的用户名>.github.io/<仓库名>/`。

之后更新内容时，重新上传覆盖文件即可，Pages 会自动重新发布。

## 目录结构

```
index.html          入口页
assets/
  app.js            游戏主程序
  style.css         页面样式
data/
  helpers.js        出题工具函数
  pictures.js       内嵌 SVG 插图（古诗画面、钟面、看图列式、单词图）
  math.js           数学 8 关题库
  chinese.js        语文 6 关题库
  english.js        英语 6 关题库
```

全部图片都是内嵌 SVG，没有外链资源，离线也能正常显示。
