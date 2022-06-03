/*
  Main token-liquidity business logic.
*/

// Local libraries
const config = require('../../config')
// const wlogger = require('./wlogger')

class TLMain {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating token-liquidity Use Cases library.'
      )
    }

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
