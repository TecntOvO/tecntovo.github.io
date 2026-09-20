# TecntOvO 个人站点

一个以中文为主的个人技术站点，视觉与信息架构参考 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)，由 GitHub Pages 托管。

## 页面与交互

- 首页默认展开左侧栏；分类、标签、归档、关于等子页面默认收起侧栏。
- 左上角按钮可随时展开或收起侧栏。
- 支持浅色、深色与跟随系统三种主题，选择会保存在当前浏览器。
- 头像使用 GitHub 头像地址，并在页面加载后尝试同步最新头像与简介。
- 桌面端采用固定侧栏，移动端自动切换为抽屉式导航。

## 修改个人信息

编辑 `dist/assets/site-config.js`：

- `profile`：昵称、头像与简介的本地备用值。
- `navigation`：侧栏页面标签及顺序。
- `socialLinks`：底部个人主页按钮。删除数组中的对象即可移除按钮；复制对象并填写 `label`、`href` 与 `icon` 即可添加。

目前 B 站按钮使用 B 站空间首页作为占位链接，请将其替换为你的个人空间地址。

## 发布

`.github/workflows/pages.yml` 会在 `master` 分支的 `dist/` 内容更新后自动发布站点。
