/*
  This library contains utilities that retrieve the last transaction (TXID)
  that involved a target address.

  The Bitcore Insight API tx/?:address and /addr/:address will return a list of
  transactions associated with an address, but it *makes no guarentee* that the
  last (or first) transaction in the returned array will be the most recent
  transaction.

  The functions in this library retrieve the transactions associated with an
  address. It then retrieves the details for each transactions, to review the
  confirmations for each transaction. It then returns an array of objects,
  containing TXIDs and confirmations, ordered by confirmation.
*/

'use strict'

module.exports = {
  getTransactions, // get transactions associated with an address.
  getTxConfs
}

// const BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default
// const BITBOX = new BITBOXSDK({ restURL: 'https://trest.bitcoin.com/v1/' })

// Get the transactions associated with an address
async function getTransactions (addr, BITBOX) {
  try {
    const txdata = BITBOX.Address.transactions(addr)
    // console.log(`txids: ${JSON.stringify(txids, null, 2)}`)

    return txdata
  } catch (err) {
    console.log(`Error in last-transaction.js/getTransactions().`)
    throw err
  }
}

// Get the number of confirmations for a transaction.
// Expects the txs array returned by getTransactions.
// Returns an array of objects, ordered is ascending order.
// Each object has a txid and confirmation property.
function getTxConfs (txdata) {
  try {
    // Data validation
    if (!Array.isArray(txdata)) throw new Error(`txdata needs to be an array`)

    const retArray = []

    for (let i = 0; i < txdata.length; i++) {
      const thisTx = txdata[i]
      const thisObj = {}

      thisObj.txid = thisTx.txid
      thisObj.confirmations = thisTx.confirmations

      retArray.push(thisObj)
    }

    // Sort the objects by confirmation, in ascending order.
    // (zero conf first, oldest conf last)
    const sortedArray = retArray.sort(function (a, b) {
      return a.confirmations - b.confirmations
    })

    return sortedArray
  } catch (err) {
    throw err
  }
}
