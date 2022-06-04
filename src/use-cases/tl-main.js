/*
  Main token-liquidity business logic.
*/

// Global npm libraries
const collect = require('collect.js')

// Local libraries
const config = require('../../config')
const Trade = require('./trade')
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
    this.trade = new Trade(localConfig)

    this.state = {
      satBalance: 0,
      bchBalance: 0,
      tokenBalance: 0
    }
  }

  // Initialize the app by setting the state.
  // - Get BCH and token balance of app wallet
  // - Get spot price of BCH
  // - Calculate the spot exchange rate between BCH/PSF token.
  async initState () {
    try {
      // Get balances of wallet
      const balance = await this.adapters.wallet.getBalances()
      // console.log(`Wallet balances: ${JSON.stringify(balance, null, 2)}`)

      // Calculate the sat and BCH balances.
      this.state.satBalance = balance.sats
      this.state.bchBalance = this.adapters.wallet.bchjs.BitcoinCash.toBitcoinCash(balance.sats)

      // Get the balance of the app token.
      const targetToken = balance.tokens.filter(x => x.tokenId === this.config.slpTokenId)
      // console.log(`targetToken: ${JSON.stringify(targetToken, null, 2)}`)
      this.state.tokenBalance = targetToken[0].qty

      // Get the spot price of BCH
      const usdPerBch = await this.adapters.wallet.wallet.getUsd()
      this.state.usdPerBch = this.adapters.wallet.bchjs.Util.floor2(usdPerBch)

      // Get the effective token balance:
      this.state.effectiveTokenBalance = this.getEffectiveTokenBalance(this.state.bchBalance)

      // Display the state of the wallet
      console.log(`Wallet balance in sats: ${this.state.satBalance}`)
      console.log(`Wallet balance in BCH: ${this.state.bchBalance}`)
      console.log(`Effective token balance: ${this.state.effectiveTokenBalance}`)
      console.log(`Actual token balance: ${this.state.tokenBalance}`)
      console.log(`App target token ID: ${this.config.slpTokenId}`)
      console.log(`Spot price of BCH: ${this.state.usdPerBch}`)
      console.log(' ')

      // console.log('this.adapters: ', this.adapters)

      // Get historical transactions for the app wallet.
      const historicalTxs = await this.adapters.bch.getTransactions(this.config.BCH_ADDR)
      this.state.seenTxs = this.adapters.bch.justTxs(historicalTxs)
    } catch (err) {
      console.error('Error in use-cases/tl-main.js/initState()')
      throw err
    }
  }

  // seenTxs = array of txs that have already been processed.
  // curTxs = Gets a list of transactions associated with the address.
  // diffTxs = diff seenTxs from curTxs
  // filter out all the txs in diffTx that are 0-conf
  // Add them to the seenTxs array after they've been processed.
  //  - Add them before processing in case something goes wrong with the processing.
  // process these txs
  async detectNewTxs (obj) {
    try {
      const { seenTxs } = obj

      const historicalTxs = await this.adapters.bch.getTransactions(config.BCH_ADDR)
      // console.log(`historicalTxs: ${JSON.stringify(historicalTxs, null, 2)}`)

      // Get just the transactions.
      const txids = historicalTxs.map((elem) => elem.tx_hash)

      const curTxs = collect(txids)
      // console.log(`curTxs: ${JSON.stringify(curTxs, null, 2)}`)

      // Diff the transactions against the list of processed txs.
      const diffTxs = curTxs.diff(seenTxs)
      // console.log(`diffTxs: ${JSON.stringify(diffTxs, null, 2)}`)

      // Exit if there are no new transactions.
      if (diffTxs.items.length === 0) return []

      // Get confirmation info on each transaction.
      const confs = await this.adapters.txs.getTxConfirmations(diffTxs.items)
      // console.log(`confs: ${JSON.stringify(confs, null, 2)}`)

      // Filter out any zero conf transactions.
      const newTxs = confs.filter((x) => x.confirmations > 0)
      // console.log(`newTxs: ${JSON.stringify(newTxs, null, 2)}`)

      return newTxs
    } catch (err) {
      console.error('Error in lib/token-liquidity.js/detectNewTxs()')
      throw err
    }
  }

  // Returns the 'effective' token balance used when calculating an exchange.
  // This is based on the BCH balance and should be less than or equal to
  // the 'actual' token balance.
  getEffectiveTokenBalance (bchBalance) {
    try {
      if (typeof bchBalance === 'undefined') {
        throw new Error('bchBalance is required')
      }

      const tokenOriginalBalance = this.config.TOKENS_QTY_ORIGINAL
      const bchOriginalBalance = this.config.BCH_QTY_ORIGINAL

      let tokenBalance =
        -1 * tokenOriginalBalance * Math.log(bchBalance / bchOriginalBalance)

      tokenBalance = this.adapters.wallet.wallet.bchjs.Util.floor8(tokenBalance)

      return tokenBalance
    } catch (err) {
      console.error('Error in use-cases/tl-main.js/getEffectiveTokenBalance().')
      throw err
    }
  }
}

module.exports = TLMain
