/*
  Main token-liquidity business logic.
*/

// Local libraries
import config from '../../config/index.js'
import { Trade } from './trade.js'

let _this

export class TLMain {
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
      tokenBalance: 0,
      effectiveTokenBalance: 0,
      usdPerBch: 200,
      seenTxs: [],
      appReady: false
    }

    // Constants manipulated by unit test.
    this.dsSleepTime = 5000

    _this = this
  }

  // Initialize the app by setting the state.
  // - Get BCH and token balance of app wallet
  // - Get spot price of BCH
  // - Calculate the spot exchange rate between BCH/PSF token.
  async initState () {
    try {
      await this.updateState()

      // Display the state of the wallet
      console.log(`Wallet balance in sats: ${this.state.satBalance}`)
      console.log(`Wallet balance in BCH: ${this.state.bchBalance}`)
      console.log(`Effective token balance: ${this.state.effectiveTokenBalance}`)
      console.log(`Actual token balance: ${this.state.tokenBalance}`)
      console.log(`App target token ID: ${this.config.slpTokenId}`)
      console.log(`Spot price of BCH: ${this.state.usdPerBch}`)
      console.log(`App BCH address: ${this.adapters.wallet.wallet.walletInfo.cashAddress}`)
      console.log(`App SLP address: ${this.adapters.wallet.wallet.walletInfo.slpAddress}`)
      console.log(' ')

      // console.log('this.adapters: ', this.adapters)

      // Get historical transactions for the app wallet.
      const bchAddr = this.adapters.wallet.wallet.walletInfo.cashAddress
      const historicalTxs = await this.adapters.bch.getTransactions(bchAddr)
      this.state.seenTxs = this.adapters.bch.justTxs(historicalTxs)

      // Note: This command should come last.
      // Signal that the app is ready to process transactions.
      this.state.appReady = true

      return true
    } catch (err) {
      console.error('Error in use-cases/tl-main.js/initState()')
      throw err
    }
  }

  // Update the state of the app, including the balance of the wallet and the
  // spot price of BCH.
  async updateState () {
    try {
      // console.log('_this.adapters.wallet: ', _this.adapters.wallet)

      if (!_this.adapters.wallet.isInitialized) {
        await _this.adapters.wallet.initWallet(_this.config.mnemonic)
      }

      // Get balances of wallet
      const balance = await _this.adapters.wallet.getBalances()
      // 11/6/22 Added this debug statement to catch an error showing up in production.
      console.log(`Wallet balances: ${JSON.stringify(balance, null, 2)}`)

      // Calculate the sat and BCH balances.
      _this.state.satBalance = balance.sats
      _this.state.bchBalance = _this.adapters.wallet.bchjs.BitcoinCash.toBitcoinCash(balance.sats)

      // Get the balance of the app token.
      const targetToken = balance.tokens.filter(x => x.tokenId === _this.config.slpTokenId)
      // 11/6/22 Added this debug statement to catch an error showing up in production.
      console.log(`targetToken: ${JSON.stringify(targetToken, null, 2)}`)
      _this.state.tokenBalance = targetToken[0].qty

      // Get the spot price of BCH
      const usdPerBch = await _this.adapters.wallet.wallet.getUsd()
      _this.state.usdPerBch = _this.adapters.wallet.bchjs.Util.floor2(usdPerBch)

      // Get the effective token balance:
      _this.state.effectiveTokenBalance = _this.getEffectiveTokenBalance(_this.state.bchBalance)

      console.log('App state updated.')

      return _this.state
    } catch (err) {
      console.log('Error in use-cases/tl-main.js/updateState()')
      throw err
    }
  }

  // Print out a summary of the state of the wallet.
  summarizeState () {
    // Token per bch price:
    const tokensPerBch = _this.trade.exchangeBCHForTokens({ bchQty: 1, state: _this.state })

    const dolPerToken = _this.state.usdPerBch / tokensPerBch

    this.adapters.wlogger.info(`Spot:: $/BCH: $${_this.state.usdPerBch}/BCH, ${tokensPerBch} tokens per BCH, $${dolPerToken} per token`)
    _this.adapters.wlogger.info(`Wallet:: BCH: ${_this.state.bchBalance}, wallet token actual balance: ${_this.state.tokenBalance}, wallet effective token balance: ${_this.state.effectiveTokenBalance}`)
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

  // Called by the timer controller when a new TXID is detected, which indicates
  // a new trade needs to be processed.
  async handleNewTx (txid) {
    try {
      if (!txid) {
        throw new Error('txid required when calling handleNewTx()')
      }

      const tradeObj = {
        txid,
        updateState: this.updateState
      }

      // Add the new TXID to the seenTxs state.
      this.state.seenTxs.push(txid)

      // Process the trade transaction with automatic retry.
      const result = await this.trade.processNewTradeTx(tradeObj)

      if (result !== null) { console.log('Trade completed with TXID: ', result) }

      return result
    } catch (err) {
      console.error('Error in handleNewTx()')
      throw err
    }
  }
}

export default TLMain
