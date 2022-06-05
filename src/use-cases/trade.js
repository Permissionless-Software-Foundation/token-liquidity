/*
  Use Case library for handling trades:
  - BCH to PSF
  - PSF to BCH

  This library is depended on by tl-main.js
*/

// Global npm libraries
const collect = require('collect.js')

// Local libraries
const config = require('../../config')

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
}

module.exports = Trade
