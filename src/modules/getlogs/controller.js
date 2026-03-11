// const User = require('../../models/users')
import shell from 'shelljs'
import config from '../../../config/index.js'

import { fileURLToPath } from 'url'
import path from 'path'

// Inspect utility used for debugging.
import util from 'util'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
    logStr = shell.exec(
      `tail --lines=200 ${path.join(__dirname, '../../../logs/', logName)}`,
      { silent: true }
    )
  }, 10000)
}

export async function getLogs (ctx) {
  ctx.body = {
    logs: logStr
  }
}

// Generates a log filename with a date string pattern matching the one used by
// winston logger: token-liquidity-YYYY-MM-DD.log
function getLogName () {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('00' + (now.getMonth() + 1)).slice(-2)
  const day = ('00' + now.getDate()).slice(-2)

  const str = `token-liquidity-${year}-${month}-${day}.log`

  return str
}
