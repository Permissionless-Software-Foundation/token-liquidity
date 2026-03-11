// const fs = require('fs')
import lineReader from 'line-reader'

const FILE_NAME = './logs/token-liquidity-2020-01-02.log'

function start () {
  readLogs(FILE_NAME)
}
start()

// Parent method for reading and displaying log file data.
async function readLogs (filename) {
  try {
    // const { name } = this.validateFlags(flags)

    // this.log(`Opening file ${name}`);

    const data = await openLogFile(filename)

    for (let i = 0; i < data.length; i++) {
      const thisEntry = data[i]

      console.log(`${thisEntry.timestamp}: ${thisEntry.message}`)
    }
  } catch (err) {
    console.log('Error in readLogs(): ', err)
  }
}

// Opens the Winston log file and returns each line as an array of JSON data.
async function openLogFile (filename) {
  try {
    // const name = `${__dirname}/../../logs/${name}`

    const data = await readLines(filename)

    return data
  } catch (err) {
    console.log('Error in openLogFile()')
    throw err
  }
}

// Returns an array with each element containing a line of the file.
function readLines (filename) {
  return new Promise((resolve, reject) => {
    try {
      const data = []
      // const i = 0

      lineReader.eachLine(filename, function (line, last) {
        try {
          data.push(JSON.parse(line))

          // Uncomment to display the raw data in each line of the winston log file.
          // console.log(`line ${i}: ${line}`)
          // i++

          if (last) return resolve(data)
        } catch (err) {}
      })
    } catch (err) {
      console.log('Error in readLines()')
      return reject(err)
    }
  })
}
