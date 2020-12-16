const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const os = require('os')
const HappyPack = require('happypack')
const webpack = require('webpack')
// fixed pug-loader 加入options后报提示
// DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions() in the next major version of loader-utils
process.noDeprecation = true

const config = require('./config')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const resolve = dir => path.join(__dirname, '..', dir)
const createHappyPlugin = (id, loaders) =>
  new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: process.env.HAPPY_VERBOSE === '1'
  })

module.exports = {
  performance: {
    // 去除文件过大的是WARNING
    hints: false
  },
  resolve: {
    // modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
    //     resolve('src'),
    //     resolve('node_modules'),
    // ],
    // mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    extensions: ['.js', '.vue'],
    alias: {
      '@': resolve('src'),
      static: resolve('static')
    }
  },
  module: {
    // noParse: /jquery|lodash/,
    rules: [
      {
        enforce: 'pre',
        test: /.js$/,
        loader: 'eslint-loader',
        include: [
          // 表示只解析以下目录，减少loader处理范围
          resolve('src')
        ],
        exclude: [path.resolve(__dirname, '../node_modules')]
      },
      {
        test: /.js$/,
        // loader: 'babel-loader',
        loader: 'happypack/loader?id=happy-babel',
        include: [resolve('src')],
        exclude: [path.join(__dirname, '../node_modules')]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /.vue$/,
        loader: 'vue-loader',
        include: [resolve('src')],
        exclude: [path.join(__dirname, '../node_modules')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'vuex': 'vuex',
  //   'elemenct-ui': 'ELEMENT',
  //   'axios': 'axios',
  //   'fastclick': 'FastClick'
  // },
  plugins: [
    createHappyPlugin('happy-babel', [
      {
        loader: 'babel-loader',
        options: {
          babelrc: true,
          cacheDirectory: true // 启用缓存
        }
      }
    ]),
    ...(config.common.needDll
      ? [
          new webpack.DllReferencePlugin({
            manifest: require('../dll/vue.dll.manifest.json')
          })
        ]
      : []),
    new VueLoaderPlugin()
  ]
}
