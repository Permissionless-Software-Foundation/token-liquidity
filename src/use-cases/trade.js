/*
  Use Case library for handling trades:
  - BCH to PSF
  - PSF to BCH

  This library is depended on by tl-main.js
*/

// Global npm libraries
const collect = require('collect.js')
const pRetry = require('p-retry')
const { default: PQueue } = require('p-queue')

// Local libraries
const config = require('../../config')

let _this

class Trade {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Trade Use Cases library.'
      )
    }

    // Encapsulate dependencies
    this.config = config
    this.queue = new PQueue({ concurrency: 1 })
    this.pRetry = pRetry

    // this.state = {}

    // Constants modified in unit tests
    this.numOfRetries = 5
    this.timeBetweenRetries = 60000 * 1

    _this = this
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

      const bchAddr = this.adapters.wallet.wallet.walletInfo.cashAddress

      const historicalTxs = await this.adapters.bch.getTransactions(bchAddr)
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
      // const confs = await this.adapters.txs.getTxConfirmations(diffTxs.items)
      // console.log(`confs: ${JSON.stringify(confs, null, 2)}`)

      // Filter out any zero conf transactions.
      // const newTxs = confs.filter((x) => x.confirmations > 0)
      // console.log(`newTxs: ${JSON.stringify(newTxs, null, 2)}`)

      return diffTxs.toArray()
    } catch (err) {
      console.error('Error in lib/token-liquidity.js/detectNewTxs()')
      throw err
    }
  }

  // This function is called by a timer Controller to periodically check for
  // new transactions sent to the apps wallet address.
  async checkForNewTxs (seenTxs) {
    const newTxids = await this.detectNewTxs({ seenTxs })

    return newTxids
  }

  // A top level function that is called by the parent tl-main.js library when
  // a new trade TXID is detected. This is largely a wrapper for the
  // pRetryProcessTx() function, which add automatic retry when errors are
  // encountered.
  // async processNewTradeTx (txid, state) {
  async processNewTradeTx (tradeObj) {
    try {
      const result = await this.queue.add(() => this.pRetryProcessTx(tradeObj))

      return result
    } catch (err) {
      console.error('Error in use-cases/trade.js/processTx()')
      throw err
    }
  }

  // This function wraps the tryProcessTx() function with the p-retry library.
  // This will allow it to try multiple times in the event of an error.
  async pRetryProcessTx (tradeObj) {
    try {
      const result = await this.pRetry(() => _this.processTx(tradeObj), {
        // This function is called in the event of an error.
        onFailedAttempt: this.handleProcessError,
        retries: this.numOfRetries // Retry 5 times
      })

      return result
    } catch (error) {
      console.log('Error in token-liquidity.js/pRetryProcessTx()')
      this.adapters.wlogger.error('Error in token-liquidity.js/pRetryProcessTx()', error)

      // Send an email to alert about the exception.
      if (this.config.useEmailAlerts) {
        console.log('placeholder2 for sending an email')

        // Try to convert the error object into a JSON string. If that's not possible,
        // then try to copy the message.
        // let errorStr = ''
        // try {
        //   errorStr = JSON.stringify(error, null, 2)
        // } catch {
        //   errorStr = error.message
        // }
        //
        // const emailObj = {
        //   callerMsg:
        //     'Warning: lib/token-liquidity.js/pRetryProcessTx() had an error, but is continuing processing. Now would be a good time to check on the app.',
        //   errorObj: errorStr
        // }
        // await _this.email.sendTLEmailAlert(emailObj)
      }

      // Note: Do not throw an error, as that will cause all other transactions
      // in the queue to be ignored.

      // This return value will immediately process the next transaction.
      return null
    }
  }

  // Handles failures when an error occurs while processing a new trade tx.
  // This function is called by this.pRetryProcessTx()
  async handleProcessError (error) {
    console.log(' ')
    _this.adapters.wlogger.info(
      `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left. Waiting ${_this.timeBetweenRetries / 60000} minutes before trying again.`
    )

    _this.adapters.wlogger.error('error caught by pRetryProcessTx(): ', error)
    console.log(' ')

    // Abort for dust attacks
    if (error.message.indexOf('Unsupported address format') > -1) {
      throw new pRetry.AbortError('Invalid OP_RETURN')
    }

    // Abort for non-PSF tokens
    if (error.message.indexOf('Dust recieved.') > -1) {
      throw new pRetry.AbortError('Dust or non-PSF token')
    }

    // Abort for dust
    if (
      error.message.includes('code 64') ||
      error.message.includes('dust')
    ) {
      throw new pRetry.AbortError('Exchange aborted because of dust.')
    }

    // If the number of retries has been exhausted, send out an email alert.
    if (!error.retriesLeft && _this.config.useEmailAlerts) {
      // Try to convert the error object into a JSON string. If that's not possible,
      // then try to copy the message.
      let errorStr = ''
      // try {
      errorStr = JSON.stringify(error, null, 2)
      // } catch {
      //   errorStr = error.message
      // }

      console.log('placeholder for sending an email')
      console.log(errorStr)
      // const emailObj = {
      //   callerMsg: 'lib/slp2.js/handleMoveTokenError()',
      //   errorObj: errorStr
      // }
      // await _this.email.sendTLEmailAlert(emailObj)
    }

    await _this.adapters.wallet.bchjs.Util.sleep(_this.timeBetweenRetries) // Sleep for 4 minutes

    return true
  }

  // Business logic for process a trade TX.
  async processTx (tradeObj = {}) {
    try {
      const { txid, updateState } = tradeObj

      if (!txid) throw new Error('txid is undefined')

      console.log(`Processing trade TX: ${txid}`)

      // Wait 5 seconds and then check the double-spend proof
      await this.adapters.wallet.wallet.bchjs.Util.sleep(this.dsSleepTime)
      const dsProof = await this.adapters.wallet.wallet.bchjs.DSProof.getDSProof(txid)
      // console.log('dsProof: ', dsProof)

      // Exit if dsProof is *not* null
      if (dsProof !== null) {
        console.log(`Double spend detected! Ignoring TXID ${txid}`)
        console.log(`dsProof: ${JSON.stringify(dsProof, null, 2)}`)
        return false
      }

      // Update the apps state before processing the new TX.
      const state = await updateState()

      // Get the BCH address for the app.
      const bchAddr = this.adapters.wallet.wallet.walletInfo.cashAddress

      // Get the sender's address for this transaction.
      const userAddr = await this.adapters.txs.getUserAddr2(txid)
      this.adapters.wlogger.info(`Sender's address: ${userAddr}`)

      // Exit if the userAddr is the same as the bchAddr for this app.
      // This occurs when the app sends bch or tokens to the user, imediately
      // after processing the users transaction and then broadcasting the trade.
      if (userAddr === bchAddr) {
        this.adapters.wlogger.info(
          'userAddr === app address. Exiting compareLastTransaction()\n'
        )

        // Signal that this was a self-generated transaction.
        return null
      }

      // Determine if this is a token TX (or not)
      const isTokenTx = await this.adapters.slp.tokenTxInfo(txid)
      this.adapters.wlogger.debug(`isTokenTx: ${isTokenTx}`)

      if (isTokenTx) {
        // User sent tokens, and wants to receive BCH.

        const bchOut = this.exchangeTokensForBCH({ tokensIn: isTokenTx, state })
        console.log(`Sending ${bchOut} BCH to ${userAddr}.`)

        const amountSat = this.adapters.wallet.bchjs.BitcoinCash.toSatoshi(bchOut)
        console.log('sats: ', amountSat)

        const receivers = [{
          address: userAddr,
          amountSat
        }]

        const txidOut = await this.adapters.wallet.wallet.send(receivers)
        console.log(`txidOut: ${txidOut[0]}\n`)

        return txidOut[0]
      } else {
        // User sent BCH, and wants to receive tokens.

        let bchQty = await this.adapters.bch.recievedBch(txid, bchAddr)
        this.adapters.wlogger.info(`${bchQty} BCH recieved.`)

        // Ensure bchQty is a number
        bchQty = Number(bchQty)
        if (isNaN(bchQty)) {
          throw new Error('bchQty could not be converted to a number.')
        }

        if (bchQty < 0.00000548) {
          throw new Error(
            "Dust recieved. This is probably a token tx that SLPDB doesn't know about."
          )
        }

        const tokensOut = this.exchangeBCHForTokens({ bchQty, state })
        console.log(`Sending ${tokensOut} tokens to ${userAddr}`)

        const txidOut = await this.adapters.wallet.sendTokens(userAddr, tokensOut)
        // console.log(`txidOut: ${txidOut[0]}\n`)
        console.log('txidOut: ', txidOut)

        return txidOut
      }

      // return true
    } catch (err) {
      console.error('Error in use-cases/trade.js/processTx()')
      throw err
    }
  }

  // Calculates the numbers of tokens to send to user, in exchange for the BCH
  // the user sent to the app.
  // This function only uses the BCH to calculate the token output.
  // This function assumes the app state has been updated before being called.
  exchangeBCHForTokens (inObj = {}) {
    try {
      const { bchQty, state } =
        inObj

      // Initialize variables.
      const bch1 = state.bchBalance
      let token1
      let token2 = 0
      const bchOriginalBalance = this.config.BCH_QTY_ORIGINAL
      const tokenOriginalBalance = this.config.TOKENS_QTY_ORIGINAL

      // Subtract 270 satoshi tx fee
      const bch2 = this.adapters.wallet.bchjs.Util.floor8(bch1 + bchQty - 0.0000027)

      // Use natural logarithm if wallet balance is less than 250 BCH.
      if (bch1 < bchOriginalBalance) {
        token1 =
          -1 * tokenOriginalBalance * Math.log(bch1 / bchOriginalBalance)
        token2 =
          -1 * tokenOriginalBalance * Math.log(bch2 / bchOriginalBalance)
      } else {
        // Use linear equation if balance is greater than 250 BCH.

        token1 = tokenOriginalBalance * (bch1 / bchOriginalBalance - 1)
        token2 = tokenOriginalBalance * (bch2 / bchOriginalBalance - 1)
      }

      token1 = this.adapters.wallet.bchjs.Util.floor8(token1)
      token2 = this.adapters.wallet.bchjs.Util.floor8(token2)

      const tokensOut = this.adapters.wallet.bchjs.Util.floor8(Math.abs(token2 - token1))

      this.adapters.wlogger.debug(
        `bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, tokensOut: ${tokensOut}`
      )

      this.adapters.wlogger.debug(`Send ${tokensOut} tokens in exchange for ${bchQty} BCH`)

      return tokensOut
    } catch (err) {
      this.adapters.wlogger.error('Error in token-liquidity.js/exchangeBCHForTokens().')
      throw err
    }
  }

  // User sent in tokens, exchange them for BCH.
  // This function assumes the app state has been updated before being called.
  exchangeTokensForBCH (inObj = {}) {
    try {
      const { tokensIn, state } = inObj

      // Initialize variables.
      let token1 = 0
      let token2 = 0
      let bch2 = 0
      const bch1 = state.bchBalance
      const bchOriginalBalance = this.config.BCH_QTY_ORIGINAL
      const tokenOriginalBalance = this.config.TOKENS_QTY_ORIGINAL

      // Use natural logarithm equations if wallet balance is less than 250 BCH
      if (bch1 < bchOriginalBalance) {
        // Calculate the 'Effective' token balance prior to recieving the new tokens.
        token1 =
          -1 * tokenOriginalBalance * Math.log(bch1 / bchOriginalBalance)

        token2 = token1 + tokensIn

        bch2 =
          bchOriginalBalance *
          Math.pow(Math.E, (-1 * token2) / tokenOriginalBalance)
        bch2 = this.adapters.wallet.bchjs.Util.floor8(bch2)
      } else {
        // Use linear equation if wallet balance is greater than (or equal to) 250 BCH.

        token1 = tokenOriginalBalance * (1 - bch1 / bchOriginalBalance)

        token2 = token1 + tokensIn

        bch2 = bchOriginalBalance * (1 - token2 / tokenOriginalBalance)
        bch2 = this.adapters.wallet.bchjs.Util.floor8(bch2)
      }

      let bchOut = bch2 - bch1 - 0.0000027 // Subtract 270 satoshi tx fee
      bchOut = Math.abs(this.adapters.wallet.bchjs.Util.floor8(bchOut))

      this.adapters.wlogger.debug(
        `bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, bchOut: ${bchOut}`
      )

      this.adapters.wlogger.debug(`${bchOut} BCH sent in exchange for ${tokensIn} tokens`)

      return bchOut
    } catch (err) {
      console.error('Error in use-cases/trade.js/exchangeTokensForBCH()')
      throw err
    }
  }
}

module.exports = Trade
