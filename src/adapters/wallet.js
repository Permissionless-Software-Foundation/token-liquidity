/*
  Adapter library for working with BCH wallet and SLP tokens.
*/

// Global npm libraries
const BchWallet = require('minimal-slp-wallet/index')

// Local libraries

class Wallet {
  constructor (localConfig = {}) {
    // Dependnecy Injection

    // Encapsulate dependencies
    this.BchWallet = BchWallet
    this.wallet = new BchWallet(undefined, {
      interface: 'rest-api',
      noUpdate: true
    })
    this.bchjs = this.wallet.bchjs
  }

  // Returns true after the wallet has been initialized.
  async initWallet (mnemonic, apiToken) {
    if (!mnemonic) {
      throw new Error('Must pass mnemonic when instantiating the Wallet class library.')
    }

    this.wallet = new this.BchWallet(mnemonic, {
      interface: 'rest-api',
      apiToken: apiToken
    })
    this.bchjs = this.wallet.bchjs

    await this.wallet.walletInfoPromise

    console.log('Wallet is initialized.')

    return true
  }
}

module.exports = Wallet
