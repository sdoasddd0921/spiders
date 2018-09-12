# 游民小爬爬
爬取游民上有趣的动图贴里的动图以及静态囧图
#### 用法
将动图页的首页填入“url”文件中，运行`app.js`。
## 问题记录
- [x] 某些网页的图的父元素不具备[align="center"]属性，无法抓取
  例如：[这篇动态图](https://www.gamersky.com/ent/201808/1083404.shtml)  
  这个帖子的p标签属性为`style="TEXT-ALIGN: center"`  
- [x] 有的`img`标签或者`a`标签就没有包在`p`标签里！
  例如：[这厮，p31](https://www.gamersky.com/ent/201808/1083126_31.shtml)
  