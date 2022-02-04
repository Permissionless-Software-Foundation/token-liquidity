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
    // console.log(`localConfig: ${JSON.stringify(localConfig, null, 2)}`);

    // Encapsulate dependencies
    this.config = localConfig
    this.tlUtils = new TLUtils()
    this.walletInfo = this.tlUtils.openWallet()
    // console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`);

    // Initialize the wallet library
    const advancedOptions = {
      restURL: localConfig.MAINNET_REST,
      apiToken: process.env.BCHJSTOKEN
    }
    this.bchWallet = new BchWallet(this.walletInfo.mnemonic, advancedOptions)
    this.bchjs = this.bchWallet.bchjs
  }

  async waitForWalletInit () {
    await this.bchWallet.walletInfoPromise
  }

  // Get the balance of the tokens held by the 245 address.
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
      wlogger.debug('Error in slp2.js/getTokenBalance: ', err)
      throw err
    }
  }

  // Retrieves SLP TX details
  async txDetails (txid) {
    try {
      wlogger.silly('Entering slp.txDetails().')

      await this.waitForWalletInit()

      const result = await this.bchjs.PsfSlpIndexer.tx(txid)
      const txData = result.txData
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`);

      const isValidSlp = txData.isValidSlp

      // Return false if the tx is not a valid SLP transaction.
      if (!isValidSlp) return false

      return txData
    } catch (err) {
      // This catch will activate on non-token txs.
      // Leave this commented out.
      wlogger.debug('Error in slp2.js/txDetails(): ', err)
      throw err
    }
  }

  // Returns a number, representing the token quantity if the TX contains a token
  // transfer. Otherwise returns false.
  // Assumes that the transfer amount is in the second output (vout[1]).
  async tokenTxInfo (txid) {
    try {
      wlogger.silly('Entering slp.tokenTxInfo().')

      const result = await this.txDetails(txid)
      // console.log(`tokenTxInfo: ${JSON.stringify(result, null, 2)}`);

      // Return false if this is not a valid SLP token.
      if (!result.isValidSlp) return false

      // Return false if this is not a token TX for the selected token.
      if (result.tokenId !== this.config.SLP_TOKEN_ID) return false

      const tokenQty = result.vout[1].tokenQty

      if (!tokenQty) return false

      return tokenQty
    } catch (err) {
      // console.log(`err: ${util.inspect(err)}`)
      wlogger.debug('Error in slp2.js/tokenTxInfo(): ', err)

      // Exit quietly and return false.
      return false
    }
  }
}

module.exports = SLP
