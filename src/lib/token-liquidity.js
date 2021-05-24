/*
  Library that contains the business logic specific to this token-liquidity app.
*/

'use strict'

const collect = require('collect.js')
const pRetry = require('p-retry')
const got = require('got')

const config = require('../../config')

// App utility functions library.
const TLUtils = require('./util')
const tlUtil = new TLUtils()

// BCH library
const BCH = require('./bch')
const bch = new BCH(config)

// SLP Token library
const SLP = require('./slp')
const slp = new SLP(config)

// Transactions library
const Transactions = require('./transactions')
const txs = new Transactions()

// Email contact library.
const Email = require('./contact')

// const bchLib = require('./send-bch')

// Winston logger
const wlogger = require('./wlogger')

// Used for debugging and iterrogating JS objects.
const util = require('util')
util.inspect.defaultOptions = { depth: 5 }

const BCH_ADDR1 = config.BCH_ADDR
// const TOKEN_ID = config.TOKEN_ID
const TOKENS_QTY_ORIGINAL = config.TOKENS_QTY_ORIGINAL
const BCH_QTY_ORIGINAL = config.BCH_QTY_ORIGINAL

// p-retry library
// const pRetry = require('p-retry')

// const seenTxs = [] // Track processed TXIDs
let _this

class TokenLiquidity {
  constructor () {
    _this = this
    _this.objProcessTx = {}

    this.slp = slp
    this.bch = bch
    this.txs = txs
    this.tlUtil = tlUtil
    this.got = got
    this.email = new Email()
    this.config = config
  }

  async getObjProcessTx () {
    return _this.objProcessTx
  }

  async setObjProcessTx (obj) {
    _this.objProcessTx = obj
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

      // Get the current list of transactions for the apps address.
      // const addrInfo = await this.bch.getBCHBalance(config.BCH_ADDR, false)
      // console.log(`addrInfo: ${JSON.stringify(addrInfo, null, 2)}`)

      const historicalTxs = await bch.getTransactions(config.BCH_ADDR)
      // console.log(`historicalTxs: ${JSON.stringify(historicalTxs, null, 2)}`)
      const txids = bch.justTxs(historicalTxs)
      // console.log(`txids: ${JSON.stringify(txids, null, 2)}`)

      const curTxs = collect(txids)
      // console.log(`curTxs: ${JSON.stringify(curTxs, null, 2)}`)

      // Diff the transactions against the list of processed txs.
      const diffTxs = curTxs.diff(seenTxs)
      // console.log(`diffTxs: ${JSON.stringify(diffTxs, null, 2)}`)

      // Exit if there are no new transactions.
      if (diffTxs.items.length === 0) return []

      // Get confirmation info on each transaction.
      const confs = await this.txs.getTxConfirmations(diffTxs.items)
      // console.log(`confs: ${JSON.stringify(confs, null, 2)}`)

      // Filter out any zero conf transactions.
      const newTxs = confs.filter(x => x.confirmations > 0)
      // console.log(`newTxs: ${JSON.stringify(newTxs, null, 2)}`)

      return newTxs
    } catch (err) {
      wlogger.error('Error in lib/token-liquidity.js/detectNewTxs()')
      throw err
    }
  }

  // Processes a single TX, sends tokens or BCH based on the type of transaction.
  async processTx (inObj) {
    try {
      const { txid, bchBalance, tokenBalance } = inObj

      // Data validation
      if (typeof txid !== 'string') throw new Error('txid needs to be a string')

      wlogger.info(`Processing new TXID ${txid}.`)

      const lastTransaction = txid

      // Get the sender's address for this transaction.
      const userAddr = await txs.getUserAddr2(lastTransaction)
      wlogger.info(`Sender's address: ${userAddr}`)

      // Exit if the userAddr is the same as the bchAddr for this app.
      // This occurs when the app sends bch or tokens to the user, imediately
      // after processing the users transaction and then broadcasting the trade.
      if (userAddr === config.BCH_ADDR) {
        wlogger.info(
          'userAddr === app address. Exiting compareLastTransaction()'
        )

        // Signal that this was a self-generated transaction.
        inObj.txid = null

        return inObj
      }

      // Process new txid.
      const isTokenTx = await slp.tokenTxInfo(lastTransaction)
      wlogger.debug(`isTokenTx: ${isTokenTx}`)

      let newTokenBalance = tokenBalance
      let newBchBalance = bchBalance

      // User sent tokens.
      if (isTokenTx) {
        wlogger.info(`${isTokenTx} tokens recieved.`)

        // Exchange tokens for BCH
        const exchangeObj = {
          tokenIn: isTokenTx,
          bchBalance: Number(bchBalance),
          bchOriginalBalance: BCH_QTY_ORIGINAL,
          tokenOriginalBalance: TOKENS_QTY_ORIGINAL
        }

        const retObj = _this.exchangeTokensForBCH(exchangeObj)
        wlogger.debug('retObj: ', retObj)

        const bchOut = retObj.bchOut
        wlogger.info(
          `Ready to send ${bchOut} BCH in exchange for ${isTokenTx} tokens`
        )

        // Update the balances
        wlogger.info(`New BCH balance: ${retObj.bch2}`)
        wlogger.info(`New token balance: ${retObj.token2}`)

        // Send BCH
        const obj = {
          recvAddr: userAddr,
          satoshisToSend: Math.floor(bchOut * 100000000)
        }
        wlogger.debug(`obj.satoshisToSend: ${obj.satoshisToSend}`)

        // Send BCH to the user.
        const hex = await bch.createBchTx(obj)
        const userBCHTXID = await bch.broadcastBchTx(hex)
        wlogger.info(`BCH sent to user: ${userBCHTXID}`)

        // User sent BCH
      } else {
        // Get the BCH send amount.
        let bchQty = await bch.recievedBch(lastTransaction, BCH_ADDR1)
        wlogger.info(`${bchQty} BCH recieved.`)

        // Ensure bchQty is a number
        bchQty = Number(bchQty)
        if (isNaN(bchQty)) {
          throw new Error('bchQty could not be converted to a number.')
        }

        if (bchQty < 0.00000547) {
          throw new Error(
            "Dust recieved. This is probably a token tx that SLPDB doesn't know about."
          )
        }

        // Exchange BCH for tokens
        const exchangeObj = {
          bchIn: Number(bchQty),
          bchBalance: Number(bchBalance),
          bchOriginalBalance: BCH_QTY_ORIGINAL,
          tokenOriginalBalance: TOKENS_QTY_ORIGINAL
        }

        // CT 7-9-2020 Debugging issues
        wlogger.info(`exchangeObj: ${JSON.stringify(exchangeObj, null, 2)}`)

        const retObj = _this.exchangeBCHForTokens(exchangeObj)

        wlogger.info(
          `Ready to send ${retObj.tokensOut} tokens in exchange for ${bchQty} BCH`
        )

        // Calculate the new balances
        newBchBalance = this.tlUtil.round8(
          Number(bchBalance) + exchangeObj.bchIn
        )
        newTokenBalance = this.tlUtil.round8(
          Number(tokenBalance) - retObj.tokensOut
        )
        wlogger.debug(`retObj: ${util.inspect(retObj)}`)
        wlogger.info(`New BCH balance: ${newBchBalance}`)
        wlogger.info(`New token balance: ${newTokenBalance}`)
        console.log('retObj.tokensOut', retObj.tokensOut)

        // Check if transaction includes an OP_RETURN instruction
        const opReturnData = await bch.readOpReturn(txid)
        // console.log(`opReturnData: ${JSON.stringify(opReturnData, null, 2)}`)

        // If the TX contains a valid OP_RETURN code
        if (opReturnData.isValid) {
          if (opReturnData.type === 'burn') {
            wlogger.info(
              `BURN OP_RETURN detected. Burning ${retObj.tokensOut} tokens.`
            )

            // Call a method in the slp library to burn a select amount of tokens
            // instead of sending them to a return address.
            const hex = await slp.burnTokenTx(retObj.tokensOut)
            await slp.broadcastTokenTx(hex)
          }

          // Normal BCH transaction with no OP_RETURN.
        } else {
          // Send Tokens
          const tokenHex = await slp.createTokenTx(
            userAddr,
            retObj.tokensOut,
            245
          )

          await slp.broadcastTokenTx(tokenHex)
        }

        // Send Tokens
        // const tokenConfig = await slp.createTokenTx(userAddr, retObj.tokensOut, 245)

        // await slp.broadcastTokenTx(tokenConfig)
      }

      const retObj = {
        txid,
        bchBalance: this.tlUtil.round8(newBchBalance),
        tokenBalance: this.tlUtil.round8(newTokenBalance)
      }

      // Report the type of transaction we just processed.
      // If tokens, report the qty of tokens.
      if (isTokenTx) {
        retObj.type = 'token'
        retObj.tokenQty = isTokenTx
      } else retObj.type = 'bch'

      wlogger.debug(`processTx() retObj: ${JSON.stringify(retObj, null, 2)}`)

      // Return the newly detected txid.
      return retObj
    } catch (err) {
      wlogger.error(`Error in token-liquidity.js/processTx(${inObj.txid})`)
      throw err
    }
  }

  // This function wraps the tryProcessTx() function with the p-retry library.
  // This will allow it to try multiple times in the event of an error.
  async pRetryProcessTx (obj) {
    try {
      // Update global var with obj
      // This is because the function that executes the p-retry library
      // cannot pass attributes as parameters
      // _this.setObjProcessTx(obj)

      if (!obj) throw new Error('obj is undefined')

      const numOfRetries = 5
      const result = await pRetry(() => _this.processTx(obj), {
        onFailedAttempt: async error => {
          //   failed attempt.
          console.log(' ')
          wlogger.info(
            `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left. Waiting 4 minutes before trying again.`
          )

          wlogger.error('error caught by pRetryProcessTx(): ', error)
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
          if (error.message.includes('code 64')) {
            throw new pRetry.AbortError('Exchange aborted because of dust.')
          }

          // If the number of retries has been exhausted, send out an email alert.
          if (!error.retriesLeft && config.useEmailAlerts) {
            const emailObj = {
              callerMsg: 'lib/slp.js/handleMoveTokenError()',
              errorObj: error
            }
            await _this.email.sendTLEmailAlert(emailObj)
          }

          await this.tlUtil.sleep(60000 * 4) // Sleep for 4 minutes
        },
        retries: numOfRetries // Retry 5 times
      })

      // Reset the global object to an empty object.
      // _this.setObjProcessTx({})

      return result
    } catch (error) {
      console.log('Error in token-liquidity.js/pRetryProcessTx()')
      wlogger.error('Error in token-liquidity.js/pRetryProcessTx()', error)
      // return error
      throw error
      // console.log(error)
    }
  }

  // Calculates the numbers of tokens to send to user, in exchange for the BCH
  // the user sent to the app.
  // This function only uses the BCH to calculate the token output.
  exchangeBCHForTokens (obj) {
    try {
      const {
        bchIn,
        bchBalance,
        bchOriginalBalance,
        tokenOriginalBalance
      } = obj

      if (!bchBalance) throw new Error('bchBalance must be defined.')

      const bch1 = bchBalance

      // Subtract 270 satoshi tx fee
      const bch2 = bch1 + bchIn - 0.0000027

      // Initialize variables.
      let token1
      let token2 = 0

      // Use natural logarithm if wallet balance is less than 250 BCH.
      if (bchBalance < bchOriginalBalance) {
        token1 = -1 * tokenOriginalBalance * Math.log(bch1 / bchOriginalBalance)
        token2 = -1 * tokenOriginalBalance * Math.log(bch2 / bchOriginalBalance)
      } else {
        // Use linear equation if balance is greater than 250 BCH.

        token1 = tokenOriginalBalance * (bch1 / bchOriginalBalance - 1)
        token2 = tokenOriginalBalance * (bch2 / bchOriginalBalance - 1)
      }

      const tokensOut = this.tlUtil.round8(Math.abs(token2 - token1))

      wlogger.debug(
        `bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, tokensOut: ${tokensOut}`
      )

      wlogger.debug(`${tokensOut} tokens sent in exchange for ${bchIn} BCH`)

      const retObj = {
        tokensOut: Math.abs(this.tlUtil.round8(tokensOut)),
        bch2: this.tlUtil.round8(bch2),
        token2: this.tlUtil.round8(token2)
      }

      return retObj
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/exchangeBCHForTokens().')
      throw err
    }
  }

  // Calculates the amount of BCH to send to the user, in exchange for the BCH
  // the user sent to the app.
  exchangeTokensForBCH (obj) {
    try {
      wlogger.silly('Entering exchangeTokensForBCH.', obj)

      const {
        tokenIn,
        // tokenBalance,
        bchBalance,
        bchOriginalBalance,
        tokenOriginalBalance
      } = obj

      if (!bchBalance) throw new Error('bchBalance must be defined.')

      const bch1 = bchBalance

      // Initialize variables.
      let token1 = 0
      let token2 = 0
      let bch2 = 0

      // Use natural logarithm equations if wallet balance is less than 250 BCH
      if (bchBalance < bchOriginalBalance) {
        // Calculate the 'Effective' token balance prior to recieving the new tokens.
        token1 =
          -1 * tokenOriginalBalance * Math.log(bchBalance / bchOriginalBalance)

        token2 = token1 + tokenIn

        bch2 =
          bchOriginalBalance *
          Math.pow(Math.E, (-1 * token2) / tokenOriginalBalance)
      } else {
        // Use linear equation if wallet balance is greater than (or equal to) 250 BCH.

        token1 = tokenOriginalBalance * (1 - bchBalance / bchOriginalBalance)

        token2 = token1 + tokenIn

        bch2 = bchOriginalBalance * (1 - token2 / tokenOriginalBalance)
      }

      let bchOut = bch2 - bch1 - 0.0000027 // Subtract 270 satoshi tx fee
      bchOut = Math.abs(tlUtil.round8(bchOut))

      wlogger.debug(
        `bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, bchOut: ${bchOut}`
      )

      wlogger.debug(`${bchOut} BCH sent in exchange for ${tokenIn} tokens`)

      const retObj = {
        bchOut,
        bch2: this.tlUtil.round8(bch2),
        token2: this.tlUtil.round8(token2)
      }

      return retObj
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/exchangeTokensForBCH().')
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

      const tokenOriginalBalance = config.TOKENS_QTY_ORIGINAL
      const bchOriginalBalance = config.BCH_QTY_ORIGINAL

      let tokenBalance =
        -1 * tokenOriginalBalance * Math.log(bchBalance / bchOriginalBalance)

      tokenBalance = _this.tlUtil.round8(tokenBalance)

      return tokenBalance
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getEffectiveTokenBalance().')
      throw err
    }
  }

  // Returns the 'spot price'. The number of tokens that would be recieved if
  // 1 BCH was sent to the liquidity app.
  getSpotPrice (bchBalance, usdPerBCH) {
    try {
      if (typeof bchBalance === 'undefined') {
        throw new Error('bchBalance is required')
      }
      if (typeof usdPerBCH === 'undefined') {
        throw new Error('usdPerBCH is required')
      }
      const obj = {
        bchIn: 1.0,
        bchBalance: bchBalance,
        bchOriginalBalance: config.BCH_QTY_ORIGINAL,
        tokenOriginalBalance: config.TOKENS_QTY_ORIGINAL
      }

      const tokensFor1BCH = _this.exchangeBCHForTokens(obj)

      const price = _this.tlUtil.round8(usdPerBCH / tokensFor1BCH.tokensOut)

      return price
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getSpotPrice().')
      throw err
    }
  }

  // Retrieve the current BCH and token balances from the blockchain.
  async getBlockchainBalances () {
    try {
      // Get BCH balance from the blockchain
      const addressInfo = await _this.bch.getBCHBalance(config.BCH_ADDR, false)

      const bchBalance = addressInfo

      wlogger.debug(`Blockchain balance: ${bchBalance} BCH`)

      const tokenBalance = await _this.slp.getTokenBalance()

      return {
        bchBalance,
        tokenBalance
      }
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getBlockchainBalances().')
      throw err
    }
  }

  async getCoinbasePrice () {
    try {
      const rawRate = await _this.got(
        'https://api.coinbase.com/v2/exchange-rates?currency=BCH'
      )

      const jsonRate = JSON.parse(rawRate.body)
      // console.log(`jsonRate: ${JSON.stringify(jsonRate, null, 2)}`)

      const usdPerBCH = jsonRate.data.rates.USD

      wlogger.debug(`USD/BCH exchange rate from Coinbase: $${usdPerBCH}`)

      return Number(usdPerBCH)
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getCoinbasePrice()')
      throw err
    }
  }

  // Get the price of BCH from Coinex
  async getCoinexPrice () {
    try {
      const price = await _this.bch.bchjs.Price.getBchUsd()

      return price
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getCoinexPrice()')
      throw err
    }
  }

  // Gets the current spot price of BCH/USD from Coinbase. If that fails, it
  // tries to get the price from Coinex. If that also fails, it returns the
  // previously saved price from the state.json file.
  // It will save the price to the state file when new priceses can be
  // successfully retrieved.
  async getPrice () {
    try {
      let usdPerBCH

      // console.log('Current blockchain: ', this.config.blockchain)

      if (this.config.blockchain === 'ecash') {
        usdPerBCH = await _this.bch.getEcashPrice()
      } else {
        // Try to get the current spot price of BCH from Coinbase, but fallback
        // to Coinex if the Coinbase feed is not accessible.
        try {
          usdPerBCH = await _this.getCoinbasePrice()
        } catch (err) {
          try {
            wlogger.error(
              'Coinbase could be be retrieved. Trying to retrieve price from Coinex'
            )

            usdPerBCH = await _this.getCoinexPrice()
          } catch (err) {
            wlogger.error(
              'Coinbase and Coinex exchange rates could not be retrieved!. Retrieving price from state.'
            )
            wlogger.error(err)

            const state = _this.tlUtil.readState()
            return state.usdPerBCH
          }
        }
      }

      config.usdPerBCH = usdPerBCH

      // Update the BCH balance
      const addressInfo = await _this.bch.getBCHBalance(config.BCH_ADDR, false)

      const bchBalance = addressInfo
      config.bchBalance = bchBalance

      // Update the effective SLP balance.
      const effBal = _this.getEffectiveTokenBalance(bchBalance)

      config.tokenBalance = effBal

      // Save the state.
      await _this.tlUtil.saveState(config)
      return config.usdPerBCH
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getPrice(): ', err)
      // throw err

      // Return the price from the state.
      const state = _this.tlUtil.readState()
      return state.usdPerBCH
    }
  }
}

module.exports = TokenLiquidity
