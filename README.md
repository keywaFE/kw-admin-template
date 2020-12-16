# kw-admin-template

> 一个 `Vue.js 2.x` + `Composition API` 的后台管理系统模板

## 构建命令

``` bash
# 安装依赖
npm install

# 本地热加载启动: localhost:8188
npm run dev

# 打包
npm run build

# 更新dll
npm run dll
```

## [Composition API](https://composition-api.vuejs.org/zh/api.html)

> 同时支持 Options API (Vue 2.x) 和 Composition API 的写法

从 `@vue/composition-api` 引入需要用到的API以及生命周期hook即可

## Hooks

* useRequest
  > 发起请求的hook

## 公共组件
* KwTable  -- 展示列表的Table
* KwFrom   -- 表单
* KwUploader  -- 上传图片/文件
* Cropper  -- 图片裁剪上传
* KwImport  -- 导入
* KwEditor  -- 富文本编辑器(ue)
