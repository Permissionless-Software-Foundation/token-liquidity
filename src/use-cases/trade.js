/*
  Use Case library for handling trades:
  - BCH to PSF
  - PSF to BCH

  This library is depended on by tl-main.js
*/

class Trade {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Trade Use Cases library.'
      )
    }
  }

  // This function is called by a timer Controller to periodically check for
  // new transactions sent to the apps wallet address.
  async checkForNewTxs () {
    console.log('hello world')
    return true
  }
}

module.exports = Trade
