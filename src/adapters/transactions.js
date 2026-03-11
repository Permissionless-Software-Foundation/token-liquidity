/*
  Library for working with BCH transactions.
*/

import config from '../../config/index.js'
import wlogger from './wlogger.js'

class Transactions {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.bchjs = localConfig.bchjs
    if (!this.bchjs && localConfig.BCHLIB) {
      this.bchjs = new localConfig.BCHLIB()
    }
    if (!this.bchjs && config.BCHLIB) {
      this.bchjs = new config.BCHLIB()
    }
    if (!this.bchjs) {
      throw new Error('Instance of bch-js required when instantiating bch.js Adapter library.')
    }

    this.config = config
  }

  // Queries the transaction details and returns the senders BCH address.
  async getUserAddr2 (txid) {
    try {
      const txDetails = await this.bchjs.RawTransactions.getRawTransaction(txid, true)

      const vin = txDetails.vin[0]
      const inputTxid = vin.txid
      const inputVout = vin.vout

      const txDetails2 = await this.bchjs.RawTransactions.getRawTransaction(inputTxid, true)

      const voutSender = txDetails2.vout[inputVout]

      const addr = voutSender.scriptPubKey.addresses[0]

      return addr
    } catch (err) {
      wlogger.error('Error in transaction.js/getUserAddr2(): ', err)
      throw err
    }
  }

  // Expects an array of txids as input. Returns an array of objects.
  async getTxConfirmations (txids) {
    try {
      if (!Array.isArray(txids)) throw new Error('txids needs to be an array')

      const data = []
      for (let i = 0; i < txids.length; i++) {
        const txid = txids[i]

        const txInfo = await this.bchjs.RawTransactions.getRawTransaction(txid, true)

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

export default Transactions
