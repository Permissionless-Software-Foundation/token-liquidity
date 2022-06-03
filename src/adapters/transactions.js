/*
  Library for working with BCH transactions.
*/

'use strict'

// Used for debugging and iterrogating JS objects.
const util = require('util')
util.inspect.defaultOptions = { depth: 5 }

const config = require('../../config')

// Winston logger
const wlogger = require('./wlogger')

// Mainnet by default
let bchjs = new config.BCHLIB({ restURL: config.MAINNET_REST })

// let _this

class Transactions {
  constructor () {
    // _this = this

    // Determine if this is a testnet wallet or a mainnet wallet.
    if (config.NETWORK === 'testnet') {
      bchjs = new config.BCHLIB({ restURL: config.TESTNET_REST })
    }

    this.bchjs = bchjs
  }

  // DEPRECATED - This function is being deprecated in favor of getUserAddr2()
  // Queries the transaction details and returns the senders BCH address.
  // async getUserAddr (txid) {
  //   try {
  //     wlogger.debug(`Entering getUserAddr(). txid: ${txid}`)
  //
  //     // const txDetails = await this.BITBOX.Transaction.details(txid)
  //     const txDetails = await this.bchjs.Blockbook.tx(txid)
  //     // console.log(`txDetails: ${JSON.stringify(txDetails, null, 2)}`)
  //
  //     // Assumption: There is only 1 vin element, or the senders address exists in
  //     // the first vin element.
  //     const vin = txDetails.vin[0]
  //     // console.log(`vin: ${JSON.stringify(vin, null, 2)}`)
  //     const senderAddr = vin.addresses[0]
  //
  //     return senderAddr
  //   } catch (err) {
  //     wlogger.debug('Error in transactions.js/getUserAddr().')
  //     throw err
  //   }
  // }

  // Queries the transaction details and returns the senders BCH address.
  // This method uses calls directly to the full node, rather than using
  // the Blockbook indexer.
  async getUserAddr2 (txid) {
    try {
      // Get the TX details for the transaction under consideration.
      const txDetails = await this.bchjs.RawTransactions.getRawTransaction(txid, true)
      // console.log(`txDetails: ${JSON.stringify(txDetails, null, 2)}`)

      // The first input represents the sender of the BCH or tokens.
      const vin = txDetails.vin[0]
      const inputTxid = vin.txid
      const inputVout = vin.vout

      // Get the TX details for the input, in order to retrieve the address of
      // the sender.
      const txDetails2 = await this.bchjs.RawTransactions.getRawTransaction(inputTxid, true)
      // console.log(`txDetails2: ${JSON.stringify(txDetails2, null, 2)}`)

      // The vout from the previous tx that represents the sender.
      const voutSender = txDetails2.vout[inputVout]

      // Extract the senders address.
      const addr = voutSender.scriptPubKey.addresses[0]

      return addr
    } catch (err) {
      wlogger.error('Error in transaction.js/getUserAddr2(): ', err)
      throw err
    }
  }

  // Deprecated??? Commenting out to see if it breaks anything.
  // Returns true if there are no 0 or 1-conf transactions associated with the address.
  // async only2Conf (bchAddr) {
  //   try {
  //     wlogger.silly('Entering only2Conf.')
  //
  //     // Get an ordered list of transactions associated with this address.
  //     let txs = await this.getTransactions(bchAddr)
  //     txs = this.getTxConfs(txs.txs)
  //
  //     if (txs[0].confirmations > 1) return true
  //
  //     return false
  //   } catch (err) {
  //     wlogger.error('Error in transactions.js/only2Conf(). Returning false', err)
  //     return false
  //   }
  // }

  // Expects an array of txids as input. Returns an array of objects.
  // Each object contains the txid and the confirmations for that tx.
  async getTxConfirmations (txids) {
    try {
      // Data validation
      if (!Array.isArray(txids)) throw new Error('txids needs to be an array')

      // Collect the confirmations for each txid.
      const data = []
      for (let i = 0; i < txids.length; i++) {
        const txid = txids[i]

        // Get the transaction data from the full node.
        const txInfo = await this.bchjs.RawTransactions.getRawTransaction(txid, true)
        // console.log(`txInfo: ${JSON.stringify(txInfo, null, 2)}`)

        // Get the confirmations for the transactions.
        let confirmations = txInfo.confirmations
        if (confirmations === undefined) confirmations = 0

        data.push({ txid, confirmations })
      }

      return data
    } catch (err) {
      wlogger.error('Error in transactions.js/getTxConfirmations()')
      throw err
    }
  }
}

module.exports = Transactions
