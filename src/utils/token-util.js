/*
  This is the primary utility library for app.js

  This file contians the JavaScript equivalent of private function.
*/

'use strict'

module.exports = {
  getBCHBalance, // Get the BCH balance for a given address.
  getTokenBalance, // Get the Token balance for a given address.
  compareLastTransaction, // Determine if any new transactions have occured involving this address.
  exchangeBCHForTokens,
  exchangeTokensForBCH,
  getLastConfirmedTransaction, // most recent 1-conf (or greater) transaction
  findBiggestUtxo, // Returns the utxo with the biggest balance from an array of utxos.
  saveState,
  readState,
  testableComponents: {
    tokenTxInfo,
    recievedBch,
    round8,
    getUserAddr,
    only2Conf
  }
}

const fs = require('fs')
const util = require('util')
util.inspect.defaultOptions = { depth: 3 }

// Winston logger
const wlogger = require('./logging')

const lastTransactionLib = require('./last-transaction.js')

const config = require('../../config')
const BCH_ADDR1 = config.BCH_ADDR
const TOKEN_ID = config.TOKEN_ID
const TOKENS_QTY_ORIGINAL = config.TOKENS_QTY_ORIGINAL
const BCH_QTY_ORIGINAL = config.BCH_QTY_ORIGINAL

const seenTxs = [] // Track processed TXIDs

// Get the balance in BCH of a BCH address.
// Returns an object containing balance information.
// The verbose flag determins if the results are written to the console or not.
async function getBCHBalance (addr, verbose, BITBOX) {
  try {
    const result = await BITBOX.Address.details([addr])

    if (verbose) {
      const resultToDisplay = result[0]
      resultToDisplay.transactions = []
      console.log(resultToDisplay)
    }

    const bchBalance = result[0]

    return bchBalance
  } catch (err) {
    wlogger.error(`Error in getBCHBalance: `, err)
    wlogger.error(`addr: ${addr}`)
    throw err
  }
}

// Get the token balance of a BCH address
async function getTokenBalance (addr, wormhole) {
  try {
    wlogger.silly(`Enter getTokenBalance()`)

    const result = await wormhole.DataRetrieval.balancesForAddress(addr)
    wlogger.debug(`token balance: `, result)

    if (result === 'Address not found') return 0
    return result
  } catch (err) {
    wlogger.error(`Error in util.js/getTokenBalance: `, err)
    throw err
  }
}

// Checks the last TX associated with the BCH address. If it changed, then
// the program reacts to it. Otherwise it exits.
// Here is the general flow of this function:
// -Organize the transactions and return an array of 1-conf transactions
// -if there are no 1-conf transactions (2-conf or greater)...
// --Retrieve the BCH and token balances from the blockchain and return those
// -else loop through each transaction in the 1-conf array
// --if the current transaction is different than the last processed transaction...
// ---if the users address matches the app address, ignore and skip.
// ---if the user sent tokens...
// ----calculate and send BCH
// ---if the user sent BCH...
// ----calculate and send tokens
// ---Calculate the new BCH and token balances and return them.
async function compareLastTransaction (obj, tknLib, bchLib, wormhole) {
  try {
    const { bchAddr, txid, bchBalance, tokenBalance } = obj

    let newBchBalance = bchBalance
    let newTokenBalance = tokenBalance

    // Get an array of 1-conf transactions
    const lastTransactions = await getLastConfirmedTransactions(bchAddr, wormhole)

    // If there are no 0 or 1-conf transactions.
    const isOnly2Conf = await only2Conf(BCH_ADDR1, wormhole)
    if (isOnly2Conf) {
      // Retrieve the balances from the blockchain.
      const retObj2 = await getBlockchainBalances(BCH_ADDR1, wormhole)
      retObj2.lastTransaction = txid
      return retObj2
    }

    // Loop through each 1-conf transaction.
    for (let i = 0; i < lastTransactions.length; i++) {
      const lastTransaction = lastTransactions[i]

      // Check to see if this Tx has already been processed.
      const notSeen = seenTxs.indexOf(lastTransaction) === -1

      // Is this a new, unseen transaction?
      if (lastTransaction !== txid && notSeen) {
        wlogger.info(`New TXID ${lastTransaction} detected.`)

        // Get the sender's address for this transaction.
        const userAddr = await getUserAddr(lastTransaction, wormhole)
        wlogger.info(`userAddr: ${util.inspect(userAddr)}`)

        // Exit if the userAddr is the same as the bchAddr for this app.
        // This occurs when the app sends bch or tokens to the user.
        if (userAddr === bchAddr) {
          wlogger.info(`userAddr === app address. Exiting compareLastTransaction()`)
          seenTxs.push(lastTransaction)
          const retObj = {
            lastTransaction: lastTransaction,
            bchBalance: newBchBalance,
            tokenBalance: newTokenBalance
          }
          return retObj
        }

        // Process new txid.
        const isTokenTx = await tokenTxInfo(lastTransaction, wormhole)
        wlogger.debug(`isTokenTx: ${isTokenTx}`)

        // User sent tokens.
        if (isTokenTx) {
          wlogger.info(`${isTokenTx} tokens recieved.`)

          // Exchange tokens for BCH
          const exchangeObj = {
            tokenIn: isTokenTx,
            tokenBalance: Number(tokenBalance),
            bchOriginalBalance: BCH_QTY_ORIGINAL,
            tokenOriginalBalance: TOKENS_QTY_ORIGINAL
          }

          const bchOut = exchangeTokensForBCH(exchangeObj)
          wlogger.info(
            `Ready to send ${bchOut} BCH in exchange for ${isTokenTx} tokens`
          )

          // Update the balances
          newTokenBalance = round8(exchangeObj.tokenBalance + isTokenTx)
          newBchBalance = round8(bchBalance - bchOut)
          wlogger.info(`New BCH balance: ${newBchBalance}`)
          wlogger.info(`New token balance: ${newTokenBalance}`)

          // Send BCH
          const obj = {
            recvAddr: userAddr,
            satoshisToSend: Math.floor(bchOut * 100000000)
          }
          wlogger.debug(`obj.satoshisToSend: ${obj.satoshisToSend}`)

          await bchLib.sendBch(obj)

        // User sent BCH
        } else {
          // Get the BCH send amount.
          const bchQty = await recievedBch(lastTransaction, BCH_ADDR1, wormhole)
          wlogger.info(`${bchQty} BCH recieved.`)

          // Exchange BCH for tokens
          const exchangeObj = {
            bchIn: Number(bchQty),
            bchBalance: Number(bchBalance),
            bchOriginalBalance: BCH_QTY_ORIGINAL,
            tokenOriginalBalance: TOKENS_QTY_ORIGINAL
          }
          const retObj = exchangeBCHForTokens(exchangeObj)

          wlogger.info(
            `Ready to send ${retObj.tokensOut} tokens in exchange for ${bchQty} BCH`
          )

          // Calculate the new balances
          // newBchBalance = retObj.bch2
          newBchBalance = round8(Number(bchBalance) + exchangeObj.bchIn)
          newTokenBalance = round8(Number(tokenBalance) - retObj.tokensOut)
          wlogger.debug(`retObj: ${util.inspect(retObj)}`)
          wlogger.info(`New BCH balance: ${newBchBalance}`)
          wlogger.info(`New token balance: ${newTokenBalance}`)

          // Send Tokens
          const obj = {
            recvAddr: userAddr,
            tokensToSend: retObj.tokensOut
          }

          await tknLib.sendTokens(obj)
        }

        // Add the last transaction TXID to the seenTxs array so that it's not
        // processed twice. Allows processing of multiple transactions in the
        // same block.
        seenTxs.push(lastTransaction)

        const retObj = {
          lastTransaction: lastTransaction,
          bchBalance: round8(newBchBalance),
          tokenBalance: round8(newTokenBalance)
        }

        // Return the newly detected txid.
        return retObj
      }
    }

    // Return false to signal no detected change in txid.
    wlogger.debug(`compareLastTransaction returning false.`)
    return false
  } catch (err) {
    wlogger.error(`Error in compareLastTransaction: `, err)
    wlogger.error(`obj: ${JSON.stringify(obj, null, 2)}`)
    throw err
  }
}

// Retrieve the current BCH and token balances from the blockchain.
async function getBlockchainBalances (bchAddr, wormhole) {
  try {
    // Get BCH balance from the blockchain
    const addressInfo = await getBCHBalance(bchAddr, false, wormhole)
    const currentBCHBalance = addressInfo.balance

    // Get current token balance
    const tokenInfo = await getTokenBalance(bchAddr, wormhole)
    const thisToken = tokenInfo.find(token => token.propertyid === TOKEN_ID)
    const tokenBalance = thisToken.balance

    wlogger.debug(`Blockchain balance: ${currentBCHBalance} BCH, ${tokenBalance} tokens`)

    return {
      bchBalance: currentBCHBalance,
      tokenBalance: tokenBalance
    }
  } catch (err) {
    wlogger.error(`Error in getBlockchainBalances()`)
    throw err
  }
}

// Get a single transaction. The last confirmed transaction. 1-conf or older.
async function getLastConfirmedTransaction (bchAddr, BITBOX) {
  try {
    wlogger.silly(`Entering getLastConfirmedTransaction.`)

    // Get an ordered list of transactions associated with this address.
    let txs = await lastTransactionLib.getTransactions(bchAddr, BITBOX)
    txs = lastTransactionLib.getTxConfs(txs.txs)

    // filter out 0-conf transactions.
    txs = txs.filter(elem => elem.confirmations > 0)

    // Retrieve the most recent 1-conf (or more) transaction.
    const lastTransaction = txs[0].txid
    wlogger.debug(`lastTransaction: ${JSON.stringify(lastTransaction, null, 2)}`)

    return lastTransaction
  } catch (err) {
    wlogger.error(`Error in getLastConfirmedTransaction: `, err)
    throw err
  }
}

// Returns an array of 1-conf transactions associated with the bch address.
async function getLastConfirmedTransactions (bchAddr, BITBOX) {
  try {
    wlogger.silly(`Entering getLastConfirmedTransactions.`)

    // Get an ordered list of transactions associated with this address.
    let txs = await lastTransactionLib.getTransactions(bchAddr, BITBOX)
    txs = lastTransactionLib.getTxConfs(txs.txs)

    // filter out 0-conf transactions.
    txs = txs.filter(elem => elem.confirmations === 1)

    const lastTxids = []
    for (let i = 0; i < txs.length; i++) {
      const thisTx = txs[i]
      lastTxids.push(thisTx.txid)
    }

    return lastTxids
  } catch (err) {
    wlogger.error(`Error in getLastConfirmedTransactions: `, err)
    throw err
  }
}

// Returns true if there are no 0 or 1-conf transactions associated with the address.
async function only2Conf (bchAddr, BITBOX) {
  try {
    wlogger.silly(`Entering only2Conf.`)

    // Get an ordered list of transactions associated with this address.
    let txs = await lastTransactionLib.getTransactions(bchAddr, BITBOX)
    txs = lastTransactionLib.getTxConfs(txs.txs)

    if (txs[0].confirmations > 1) return true

    return false
  } catch (err) {
    console.log(`Error in only2Conf().`)
    return false
  }
}

// Returns a number, representing the token quantity if the TX contains a token
// transfer. Otherwise returns false.
async function tokenTxInfo (txid, wormhole) {
  try {
    wlogger.silly(`Entering tokenTxInfo().`)

    const retVal = await wormhole.DataRetrieval.transaction(txid)
    wlogger.debug(`tokenTxInfo retVal: ${JSON.stringify(retVal, null, 2)}`)

    if (retVal.message === 'Not a Wormhole Protocol transaction') return false

    return Number(retVal.amount)
  } catch (err) {
    return false
  }
}

// Calculates the amount of BCH was sent to this app from a TX.
// Returns a floating point number of BCH recieved. 0 if no match found.
async function recievedBch (txid, addr, BITBOX) {
  try {
    wlogger.silly(`Entering receivedBch().`)

    const txDetails = await BITBOX.Transaction.details(txid)
    // console.log(`txDetails: ${JSON.stringify(txDetails, null, 2)}`)

    const vout = txDetails.vout

    // Loop through each vout in the TX.
    for (let i = 0; i < vout.length; i++) {
      const thisVout = vout[i]
      // console.log(`thisVout: ${JSON.stringify(thisVout, null, 2)}`);
      const value = thisVout.value

      // Skip if value is zero.
      if (Number(thisVout.value) === 0.0) continue

      // Skip if vout has no addresses field.
      if (thisVout.scriptPubKey.addresses) {
        const addresses = thisVout.scriptPubKey.addresses
        // console.log(`addresses: ${JSON.stringify(addresses, null, 2)}`);

        // Note: Assuming addresses[] only has 1 element.
        // Not sure how there can be multiple addresses if the value is not an array.
        let address = addresses[0] // Legacy address
        address = BITBOX.Address.toCashAddress(address)

        if (address === addr) return Number(value)
      }
    }

    // Address not found. Return zero.
    return 0
  } catch (err) {
    wlogger.error(`Error in recievedBch: `, err)
    throw err
  }
}

// Calculates the numbers of tokens to send.
function exchangeBCHForTokens (obj) {
  try {
    const { bchIn, bchBalance, bchOriginalBalance, tokenOriginalBalance } = obj

    const bch1 = bchBalance
    const bch2 = bch1 - bchIn - 0.00000270 // Subtract 270 satoshi tx fee

    const token1 = -1 * tokenOriginalBalance * Math.log(bch1 / bchOriginalBalance)
    const token2 = -1 * tokenOriginalBalance * Math.log(bch2 / bchOriginalBalance)

    const tokensOut = token2 - token1

    wlogger.debug(`bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, tokensOut: ${tokensOut}`)

    wlogger.debug(`${tokensOut} tokens sent in exchange for ${bchIn} BCH`)

    const retObj = {
      tokensOut: Math.abs(round8(tokensOut)),
      bch2,
      token2
    }

    return retObj
  } catch (err) {
    wlogger.error(`Error in util.js/exchangeBCHForTokens() `)
    throw err
  }
}

// Round a number to 8 decimal places, the standard used for Bitcoin.
function round8 (numIn) {
  return Math.floor(numIn * 100000000) / 100000000
}

// Calculates the amount of BCH to send.
function exchangeTokensForBCH (obj) {
  try {
    wlogger.silly(`Entering exchangeTokensForBCH.`, obj)

    const { tokenIn, tokenBalance, bchOriginalBalance, tokenOriginalBalance } = obj

    const token1 = tokenBalance - tokenOriginalBalance
    const token2 = token1 + tokenIn

    const bch1 = bchOriginalBalance * Math.pow(Math.E, -1 * token1 / tokenOriginalBalance)
    const bch2 = bchOriginalBalance * Math.pow(Math.E, -1 * token2 / tokenOriginalBalance)

    const bchOut = bch2 - bch1 - 0.00000270 // Subtract 270 satoshi tx fee

    wlogger.debug(`bch1: ${bch1}, bch2: ${bch2}, token1: ${token1}, token2: ${token2}, bchOut: ${bchOut}`)

    return Math.abs(round8(bchOut))
  } catch (err) {
    wlogger.error(`Error in exchangeTokensForBCH().`)
    throw err
  }
}

// Queries the transaction details and returns the senders BCH address.
async function getUserAddr (txid, BITBOX) {
  try {
    wlogger.silly(`Entering getUserAddr().`)
    wlogger.debug(`txid: ${txid}`)

    const txDetails = await BITBOX.Transaction.details(txid)

    // Assumption: There is only 1 vin element, or the senders address exists in
    // the first vin element.
    const vin = txDetails.vin[0]
    const senderAddr = vin.cashAddress

    return senderAddr
  } catch (err) {
    wlogger.debug(`Error in util.js/getUserAddr().`)
    throw err
  }
}

// Returns the utxo with the biggest balance from an array of utxos.
function findBiggestUtxo (utxos) {
  try {
    wlogger.silly(`Entering findBiggestUtxo().`)

    let largestAmount = 0
    let largestIndex = 0

    for (let i = 0; i < utxos.length; i++) {
      const thisUtxo = utxos[i]

      if (thisUtxo.satoshis > largestAmount) {
        largestAmount = thisUtxo.satoshis
        largestIndex = i
      }
    }

    return utxos[largestIndex]
  } catch (err) {
    wlogger.error(`Error in findBiggestUtxo().`)
    throw err
  }
}

function saveState (data) {
  try {
    wlogger.silly(`entering token-util.js saveState().`)

    const filename = `${__dirname}/../../state/state.json`

    return new Promise((resolve, reject) => {
      fs.writeFile(filename, JSON.stringify(data, null, 2), function (err) {
        if (err) {
          wlogger.error(`Error in token-util.js/saveState(): `, err)
          return reject(err)
        }

        wlogger.silly(`Successfully saved to state.json`)

        // console.log(`${name}.json written successfully.`)
        return resolve()
      })
    })
  } catch (err) {
    wlogger.debug(`Error in token-util.js/saveState()`, err)
    throw err
  }
}

// Open and read known-peers.json
function readState (filename) {
  // const filename = '../../peers/known-peers.json'

  try {
    // const filename = `${__dirname}/../../config/state.json`

    // Delete the cached copy of the data.
    delete require.cache[require.resolve(filename)]

    const data = require(filename)
    return data
  } catch (err) {
    wlogger.debug(`Error in token-util.js/saveState()`, err)
    throw new Error(`Could not open ${filename}`)
  }
}
