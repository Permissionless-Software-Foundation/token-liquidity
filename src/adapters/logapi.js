import path from 'path'
import { fileURLToPath } from 'url'
import lineReader from 'line-reader'
import fs from 'fs'

import config from '../../config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let _this

class LogsApi {
  constructor () {
    _this = this
    _this.fs = fs
    _this.lineReader = lineReader
    _this.config = config
  }

  async getLogs (password) {
    try {
      _this.password = password

      if (password === _this.config.logPass) {
        const fullPath = _this.generateFileName()

        if (!_this.fs.existsSync(fullPath)) {
          return {
            success: false,
            data: 'file does not exist'
          }
        } else {
          const data = await _this.readLines(fullPath)
          const filteredData = _this.filterLogs(data)

          return {
            success: true,
            data: filteredData
          }
        }
      } else {
        return {
          success: false
        }
      }
    } catch (err) {
      console.error('Error in lib/logapi.js/getLogs()')
      throw err
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
      console.error('Error in lib/logapi.js/filterLogs()')
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
      const logDir = path.join(__dirname, '../../logs/')
      const fullPath = path.join(logDir, filename)

      return fullPath
    } catch (err) {
      console.error('Error in lib/logapi.js/generateFileName()')
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
        console.log('Error in lib/logapi.js/readLines()')
        return reject(err)
      }
    })
  }
}

export default LogsApi
