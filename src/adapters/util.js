/*
  This library contains general utility functions. This library is specific
  to token-liquidty, which is why its in the lib/ folder and not the utils/
  folder.
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '../../config/index.js'
import wlogger from './wlogger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STATE_FILE_NAME = path.join(__dirname, '../../state/state.json')

class TLUtils {
  // Round a number to 8 decimal places, the standard used for Bitcoin.
  round8 (numIn) {
    return Math.floor(numIn * 100000000) / 100000000
  }

  // Save the app state to a JSON file.
  saveState (data) {
    try {
      wlogger.silly('entering util.js/saveState().')

      const filename = STATE_FILE_NAME

      return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data, null, 2), function (err) {
          if (err) {
            wlogger.error('Error in token-util.js/saveState(): ', err)
            return reject(err)
          }

          wlogger.silly('Successfully saved to state.json')

          return resolve()
        })
      })
    } catch (err) {
      wlogger.debug('Error in token-util.js/saveState()')
      throw err
    }
  }

  // Open and read the state JSON file.
  readState () {
    try {
      const data = fs.readFileSync(STATE_FILE_NAME, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      wlogger.debug('Error in util.js/readState()')
      throw new Error(`Could not open ${STATE_FILE_NAME}`)
    }
  }

  // Opens the wallet file and returns the contents.
  openWallet () {
    try {
      let walletPath

      if (process.env.TL_ENV === 'test') {
        walletPath = path.join(__dirname, '../../test/unit/mocks/fake-wallet.json')
      } else {
        walletPath = path.join(__dirname, '../../wallet-main.json')
      }

      const data = fs.readFileSync(walletPath, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      throw new Error('wallet file not found')
    }
  }

  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Check that all the environment variables are set and 'make sense' before
  // allowing the app to start.
  checkEnvVars (configObj) {
    try {
      console.log(`config: ${JSON.stringify(configObj, null, 2)}`)

      // Check email settings.
      if (config.emailServer === 'mail.someserver.com') {
        console.warn(
          '\nWarning: Email server variables not set! Email notifications will not be sent.\n'
        )
      }

      // Check required settings.
      if (!config.BCH145ADDR) {
        throw new Error('BCH 145 derivation address not set!')
      }
      if (!config.SLP145ADDR) {
        throw new Error('SLP 145 derivation address not set!')
      }
      if (!config.BCH245ADDR) {
        throw new Error('BCH 245 derivation address not set!')
      }
      if (!config.SLP245ADDR) {
        throw new Error('SLP 245 derivation address not set!')
      }
      if (!config.SLP_TOKEN_ID) {
        throw new Error('SLP Token ID not set!')
      }
    } catch (err) {
      console.log(
        `Error in src/lib/util.js/checkEnvVars().\nDid you create a .env file?\nShutting down. Reason: \n${err.message}`
      )
      process.exit(1)
    }
  }
}

export default TLUtils
