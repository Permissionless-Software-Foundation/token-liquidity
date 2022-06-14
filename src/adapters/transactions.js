/*
  Library for working with BCH transactions.
*/

// Local libraries
const config = require('../../config')
const wlogger = require('./wlogger')

// let _this

class Transactions {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error('Instance of bch-js required when instantiating bch.js Adapter library.')
    }

    // Encapsulate dependencies
    this.config = config
  }

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
