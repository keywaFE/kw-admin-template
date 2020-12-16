const opn = require('opn')
const express = require('express')
const chalk = require('chalk')
const app = express()
const config = require('./config.js')
const url = 'http://localhost:9002'
app.use(express.static(config.build.path))
app.listen('9002', () => {
  console.log(chalk.green.bold(` Preview on  ${url}\n`))
  opn(url)
})
