/*
  Adapter library for working with BCH wallet and SLP tokens.
*/

// Global npm libraries
const BchWallet = require('minimal-slp-wallet')

// Local libraries
const wlogger = require('./wlogger')
const config = require('../../config')

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
    this.wlogger = wlogger
    this.config = config
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
    console.log(`Wallet address: ${this.wallet.walletInfo.cashAddress}`)
    await this.wallet.initialize()

    console.log('Wallet is initialized.')

    return true
  }

  // Get balances of BCH and tokens.
  async getBalances () {
    try {
      // Update the wallet UTOXs.
      await this.wallet.getUtxos()

      const bchBalance = await this.wallet.getBalance()
      // console.log('bchBalance: ', bchBalance)

      const slpBalance = await this.wallet.listTokens()
      // console.log('slpBalance: ', slpBalance)

      const outObj = {
        sats: bchBalance,
        tokens: slpBalance
      }

      return outObj
    } catch (err) {
      this.wlogger.error('Error in wallet.js/getBalances()')
      throw err
    }
  }

  // Send a quantity of tokens to an address.
  async sendTokens (address, qty) {
    try {
      const receiver = {
        address,
        qty,
        tokenId: this.config.slpTokenId
      }

      const txid = await this.wallet.sendTokens(receiver, 3)

      return txid
    } catch (err) {
      console.error('Error in adapters/wallet.js/sendTokens()')
      throw err
    }
  }
}

module.exports = Wallet
