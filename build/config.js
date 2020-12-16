const path = require('path')
// const proxyBase = 'http://test.uc.keywa.cc'
const proxyBase = 'http://dev-qy.keywa.cc'
module.exports = {
  common: {
    needDll: true
  },
  build: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  dev: {
    path: path.resolve(__dirname, '../static'),
    publicPath: '/',
    port: 8188,
    proxyBase: proxyBase,
    proxy: {
      '/': {
        target: proxyBase,
        changeOrigin: true
      }
    }
  }
}
