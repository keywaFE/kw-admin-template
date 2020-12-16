const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const HTMLPlugin = require('html-webpack-plugin')
const config = require('./config')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const autoAddDllRes = () => {
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
  return new AddAssetHtmlPlugin([
    {
      // 往html中注入dll js
      publicPath: '/dll/', // 注入到html中的路径
      outputPath: 'dll', // 最终输出的目录
      filepath: resolve('dll/*.js'),
      includeSourcemap: false,
      typeOfAsset: 'js' // options js、css default js
    }
  ])
}
module.exports = port => {
  return webpackMerge(baseConfig, {
    mode: 'development',
    entry: {
      server: `webpack-dev-server/client?http://localhost:${port}`,
      index: [path.join(__dirname, `../src/main.js`)]
    },
    output: {
      path: config.dev.path,
      publicPath: config.dev.publicPath
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['css-hot-loader', 'style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new HTMLPlugin({
        template: path.join(__dirname, `../index.html`),
        minify: false
      }),
      ...(config.common.needDll ? [autoAddDllRes()] : []),
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}
