/*
  This is a completely refactored version of the original slp.js library.
  This version uses the psf-slp-indexer and minimal-slp-wallet to implement
  a lot of the SLP functionality.
*/

// Public npm libraries
const BchWallet = require('minimal-slp-wallet/index')

// Local libraries
const TLUtils = require('./util')
const wlogger = require('./wlogger')

class SLP {
  constructor (localConfig = {}) {
    console.log(`localConfig: ${JSON.stringify(localConfig, null, 2)}`)

    // Encapsulate dependencies
    this.config = localConfig
    this.tlUtils = new TLUtils()
    this.walletInfo = this.tlUtils.openWallet()
    console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`)

    // Initialize the wallet library
    const advancedOptions = {
      restURL: localConfig.MAINNET_REST,
      apiToken: process.env.BCHJSTOKEN
    }
    this.bchWallet = new BchWallet(this.walletInfo.mnemonic, advancedOptions)
  }

  async waitForWalletInit () {
    await this.bchWallet.walletInfoPromise
  }

  async getTokenBalance () {
    try {
      wlogger.silly('Enter slp2.getTokenBalance()')

      // console.log(`this.config.SLP_TOKEN_ID: ${this.config.SLP_TOKEN_ID}`);

      await this.waitForWalletInit()

      const result = await this.bchWallet.listTokens(this.config.SLP245ADDR)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`);

      const targetToken = result.filter(
        (x) => x.tokenId === this.config.SLP_TOKEN_ID
      )

      if (targetToken.length === 0) return 0

      return targetToken[0].qty
    } catch (err) {
      wlogger.error('Error in slp2.js/getTokenBalance: ', err)
      throw err
    }
  }
}

module.exports = SLP
