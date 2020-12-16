const fs = require('fs')
const path = require('path')
const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const getModules = () =>
  fs
    .readdirSync(path.resolve(__dirname, '../src/views/'))
    .filter(item => item !== '_layouts' && item !== '_includes')
const getEntries = modules => {
  return modules.reduce((rs, module, input) => {
    rs[module] = path.join(__dirname, `../src/views/${module}/index.js`)
    return rs
  }, {})
}

exports.randomRange = randomRange
exports.getModules = getModules
exports.getEntries = getEntries
