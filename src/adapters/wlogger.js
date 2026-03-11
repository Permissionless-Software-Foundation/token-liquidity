/*
  Instantiates and configures the Winston logging library. This utitlity library
  can be called by other parts of the application to conveniently tap into the
  logging library.
*/

import path from 'path'
import { fileURLToPath } from 'url'
import winston from 'winston'
import 'winston-daily-rotate-file'

import config from '../../config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure daily-rotation transport.
const transport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, '../../logs', `koa-${config.env}-%DATE%.log`),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '1m', // 1 megabyte
  maxFiles: '5d', // 5 days
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
})

// This controls what goes into the log FILES
const wlogger = winston.createLogger({
  level: 'verbose',
  format: winston.format.json(),
  transports: [
    transport
  ]
})

transport.on('rotate', function (oldFilename, newFilename) {
  wlogger.info('Rotating log files')
})

// Add simple logging to the console.
if (config.env !== 'test') {
  wlogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: 'debug'
    })
  )
}

export default wlogger
