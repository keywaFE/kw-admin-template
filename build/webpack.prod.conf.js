const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')
// const cpuCount = require('os').cpus().length
// 获取入口
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
// 抽取css为独立文件
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'css/[name].[chunkhash:8].css'
})


// 根据入口循环设置htmlplugin
const htmlPlugins = [
  new HTMLPlugin({
    chunks: ['manifest', 'index'],
    template: path.join(__dirname, `../index.html`),
    filename: `index.html`
  })
]

// 拷贝静态资源到输出目录
const copyPlugin = new CopyWebpackPlugin([
  {
    from: config.dev.path,
    to: config.build.path,
    ignore: ['.*']
  }
])

const autoAddDllRes = () => {
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
  return new AddAssetHtmlPlugin([
    {
      // 往html中注入dll js
      publicPath: './dll/', // 注入到html中的路径
      outputPath: 'dll', // 最终输出的目录
      filepath: resolve('/dll/*.js'),
      includeSourcemap: false,
      typeOfAsset: 'js' // options js、css default js
    }
  ])
}

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  entry: {
    index: [path.join(__dirname, `../src/main.js`)]
  },
  output: {
    path: config.build.path,
    publicPath: config.build.publicPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader' // css -> commonjs
          },
          {
            loader: 'sass-loader' // sass -> css
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      // uglifyJs,
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          // 避免 cssnano 重新计算 z-index
          safe: true
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
          name: 'vendor'
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: Infinity
        }
      }
    }
  },
  plugins: [
    miniCssExtractPlugin,
    ...htmlPlugins,
    ...(config.common.needDll ? [autoAddDllRes()] : []),
    copyPlugin
  ]
})
