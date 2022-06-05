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

    // Constants modified in unit tests
    this.numOfRetries = 5
    this.timeBetweenRetries = 60000 * 1

    _this = this
  }

  // This function is called by a timer Controller to periodically check for
  // new transactions sent to the apps wallet address.
  async checkForNewTxs (seenTxs) {
    const now = new Date()
    const outStr = `${now.toLocaleString()}: Checking transactions... `
    console.log(outStr)

    const newTxids = await this.detectNewTxs({ seenTxs })

    return newTxids
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

  // A top level function that is called by the parent tl-main.js library when
  // a new trade TXID is detected. This is largely a wrapper for the
  // pRetryProcessTx() function, which add automatic retry when errors are
  // encountered.
  async processNewTradeTx (txid) {
    try {
      console.log(`Processing trade TX: ${txid}`)

      const result = await this.queue.add(() => this.pRetryProcessTx(txid))

      return result
    } catch (err) {
      console.error('Error in use-cases/trade.js/processTx()')
      throw err
    }
  }

  // This function wraps the tryProcessTx() function with the p-retry library.
  // This will allow it to try multiple times in the event of an error.
  async pRetryProcessTx (txid) {
    try {
      if (!txid) throw new Error('txid is undefined')

      const result = await pRetry(() => _this.processTx(txid), {
        // This function is called in the event of an error.
        onFailedAttempt: async (error) => {
          //   failed attempt.
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
            try {
              errorStr = JSON.stringify(error, null, 2)
            } catch {
              errorStr = error.message
            }

            console.log('placeholder for sending an email')
            console.log(errorStr)
            // const emailObj = {
            //   callerMsg: 'lib/slp2.js/handleMoveTokenError()',
            //   errorObj: errorStr
            // }
            // await _this.email.sendTLEmailAlert(emailObj)
          }

          await this.adapters.wallet.bchjs.Util.sleep(this.timeBetweenRetries) // Sleep for 4 minutes
        },
        retries: this.numOfRetries // Retry 5 times
      })

      // Reset the global object to an empty object.
      // _this.setObjProcessTx({})

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

      // Note: Do not throw an error, as that will prevent any other transactions
      // in the queue to be ignored.

      // This return value will immediately process the next transaction.
      return { txid: null }
    }
  }

  // Business logic for process a trade TX.
  async processTx (txid) {
    try {
      console.log(`Processing trade TX: ${txid}`)

      return true
    } catch (err) {
      console.error('Error in use-cases/trade.js/processTx()')
      throw err
    }
  }
}

module.exports = Trade
