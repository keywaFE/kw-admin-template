const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const config = require('./config.js')
const opn = require('opn')

const port = config.dev.port
const proxy = config.dev.proxy
const proxyBase = config.dev.proxyBase
const webpackConfig = require('./webpack.dev.conf')(port)
const compiler = webpack(webpackConfig)

const url = 'http://localhost:' + port
const serverConfig = {
  contentBase: config.dev.path,
  quiet: true,
  overlay: {
    errors: true
  },
  proxy: proxy
}
new WebpackDevServer(compiler, serverConfig).listen(port, 'localhost', err => {
  if (err) {
    console.log('server err: ', err)
  }
  console.log(`> Listening: ${chalk.bold.green(url)}`)
  console.log(`> Proxy: ${chalk.bold.green(proxyBase)}`)
  opn(url)
})
