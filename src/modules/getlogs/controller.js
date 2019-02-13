// const User = require('../../models/users')
const shell = require('shelljs')
const config = require('../../../config')

// Winston logger
// const wlogger = require('../../utils/logging')

// Inspect utility used for debugging.
const util = require('util')
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

let logStr = '' // Holds current logs.

// Periodically update the logStr with the latest logs.
if (config.NETWORK === 'testnet') {
  setInterval(function () {
    const logName = getLogName()
    logStr = shell.exec(`tail --lines=200 ${__dirname}/../../../logs/${logName}`, {silent: true})
    // console.log(`logs: ${logStr}`)
  }, 10000)
}

module.exports = {
  getLogs
}

async function getLogs (ctx) {
  ctx.body = {
    logs: logStr
  }
}

// Generates a log filename with a date string pattern matching the one used by
// winston logger:
// token-liquidity-YYYY-MM-DD.log
function getLogName () {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('00' + (now.getMonth() + 1)).slice(-2)
  const day = ('00' + now.getDate()).slice(-2)

  const str = `token-liquidity-${year}-${month}-${day}.log`
  // console.log(`getLogName(): ${str}`)

  return str
}
