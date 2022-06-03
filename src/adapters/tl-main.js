/*
  Main token-liquidity adapter. This kicks off a lot of the main processing code.
*/

// Local libraries
const config = require('../../config')
// const wlogger = require('./wlogger')

class TLMain {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.config = config
  }

  // async start() {
  //   try {
  //     // Get the balance of the wallet.
  //     const balances =
  //   } catch(err) {
  //     wlogger.error('Error in tl-main.js/start()')
  //     throw err
  //   }
  // }
}

module.exports = TLMain
