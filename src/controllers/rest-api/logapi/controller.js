import LogsApiLib from '../../../adapters/logapi.js'

import { fileURLToPath } from 'url'
import path from 'path'
const logsApiLib = new LogsApiLib()
let _this
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class LogsApi {
  constructor () {
    _this = this
    _this.logsApiLib = logsApiLib
  }

  /**
   * @api {post} /logapi Parse and return the log files.
   * @apiPermission public
   * @apiName LogApi
   * @apiGroup Logs
   */
  async getLogs (ctx) {
    try {
      const password = ctx.request.body.password
      const result = await _this.logsApiLib.getLogs(password)
      ctx.body = result
    } catch (err) {
      if (err && err.message) {
        ctx.throw(422, err.message)
      } else {
        ctx.throw(500, 'Unhandled error')
      }
    }
  }

  filterLogs (data, LIMIT = 100) {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Data must be array')
      }

      data.sort(function (a, b) {
        let dateA = new Date(a.timestamp)
        dateA = dateA.getTime()

        let dateB = new Date(b.timestamp)
        dateB = dateB.getTime()

        return dateB - dateA
      })

      if (data.length > LIMIT) {
        return data.slice(0, LIMIT)
      }

      return data
    } catch (err) {
      console.error('Error in logapi/controller.js/filterLogs()')
      throw err
    }
  }

  generateFileName () {
    try {
      const now = new Date()
      let thisDate = now.getDate()
      thisDate = ('0' + thisDate).slice(-2)

      let thisMonth = now.getMonth() + 1
      thisMonth = ('0' + thisMonth).slice(-2)

      const thisYear = now.getFullYear()

      const filename = `koa-${
        _this.config.env
      }-${thisYear}-${thisMonth}-${thisDate}.log`

      console.log(`Attempted to read log filename: ${filename}`)

      const logDir = path.join(__dirname, '../../../logs/')

      const fullPath = `${logDir}${filename}`

      return fullPath
    } catch (err) {
      console.error('Error in logapi/controller.js/generateFileName()')
      throw err
    }
  }

  readLines (filename) {
    return new Promise((resolve, reject) => {
      try {
        if (!filename || typeof filename !== 'string') {
          throw new Error('filename must be a string')
        }

        if (!_this.fs.existsSync(filename)) {
          throw new Error('file does not exist')
        }

        const data = []

        _this.lineReader.eachLine(filename, function (line, last) {
          try {
            data.push(JSON.parse(line))

            if (last) return resolve(data)
          } catch (err) {
            if (last) return resolve(data)
          }
        })
      } catch (err) {
        console.log('Error in readLines()')
        return reject(err)
      }
    })
  }
}

export default LogsApi
