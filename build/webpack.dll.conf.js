const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const dllPath = path.resolve(__dirname, '../dll') // dll文件存放的目录

module.exports = {
  entry: {
    // 把 vue 相关模块的放到一个单独的动态链接库
    vue: ['vue', 'vue-router', 'vuex', 'axios', 'element-ui']
  },
  output: {
    filename: '[name]-[chunkhash:8].dll.js', // 生成vue.dll.js
    path: dllPath,
    library: '_dll_[name]'
  },
  plugins: [
    new CleanWebpackPlugin(['*.js'], {
      // 清除之前的dll文件
      root: dllPath
    }),
    new webpack.DllPlugin({
      name: '_dll_[name]',
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, '../dll', '[name].dll.manifest.json')
    })
  ]
}
