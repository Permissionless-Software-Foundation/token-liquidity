/*
  Adapted from the wormholecash example code.
*/

'use strict'

const config = require('../../config')

const BITBOXCli = require('bitbox-sdk/lib/bitbox-sdk').default
let BITBOX
if (config.NETWORK === `testnet`) {
  BITBOX = new BITBOXCli({ restURL: 'https://trest.bitcoin.com/v1/' })
} else {
  BITBOX = new BITBOXCli({ restURL: 'https://rest.bitcoin.com/v1/' })
}

const lib = require('./token-util.js')

module.exports = {
  sendBch
}

// Replace the address below with the address you want to send the BCH to.
// const RECV_ADDR = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`;
// const satoshisToSend = 109999000;
// const satoshisToSend = 1000;

// Open the wallet generated with create-wallet.
let walletInfo
try {
  walletInfo = require(`${__dirname}/../../wallet.json`)
} catch (err) {
  console.log(`Could not open ${__dirname}/../../wallet.json. Generate a wallet with create-wallet first.`)
  process.exit(0)
}

const SEND_ADDR = walletInfo.cashAddress
const SEND_MNEMONIC = walletInfo.mnemonic

// Send BCH to an address.
async function sendBch (obj) {
  try {
    const RECV_ADDR = obj.recvAddr
    const satoshisToSend = obj.satoshisToSend

    console.log(`Starting sendBch()...`)

    const balance = await getBCHBalance(SEND_ADDR, false)
    console.log(`balance: ${JSON.stringify(balance, null, 2)}`)
    console.log(`Balance of sending address ${SEND_ADDR} is ${balance} BCH.`)

    if (balance <= 0.0) {
      console.log(`Balance of sending address is zero. Exiting.`)
      process.exit(0)
    }

    const SEND_ADDR_LEGACY = BITBOX.Address.toLegacyAddress(SEND_ADDR)
    const RECV_ADDR_LEGACY = BITBOX.Address.toLegacyAddress(RECV_ADDR)
    console.log(`Sender Legacy Address: ${SEND_ADDR_LEGACY}`)
    console.log(`Receiver Legacy Address: ${RECV_ADDR_LEGACY}`)

    const balance2 = await getBCHBalance(RECV_ADDR, false)
    console.log(`Balance of recieving address ${RECV_ADDR} is ${balance2} BCH.`)

    // const utxo = await BITBOX.Address.utxo(SEND_ADDR);
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);
    const u = await BITBOX.Address.utxo([SEND_ADDR])
    const utxo = lib.findBiggestUtxo(u[0])
    utxo.value = utxo.amount

    // instance of transaction builder
    let transactionBuilder
    if (config.NETWORK === `testnet`) {
      transactionBuilder = new BITBOX.TransactionBuilder('testnet')
    } else {
      transactionBuilder = new BITBOX.TransactionBuilder()
    }

    // const satoshisToSend = 1000;
    const originalAmount = utxo.satoshis
    const vout = utxo.vout
    const txid = utxo.txid

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout)

    // get byte count to calculate fee. paying 1 sat/byte
    const byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 2 })
    console.log(`byteCount: ${byteCount}`)
    const satoshisPerByte = 1.2
    const txFee = Math.floor(satoshisPerByte * byteCount)
    console.log(`txFee: ${txFee}`)

    // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - satoshisToSend - txFee
    console.log(`remainder: ${remainder}`)

    // add output w/ address and amount to send
    transactionBuilder.addOutput(BITBOX.Address.toLegacyAddress(RECV_ADDR), satoshisToSend)
    transactionBuilder.addOutput(BITBOX.Address.toLegacyAddress(SEND_ADDR), remainder)

    // Generate a change address from a Mnemonic of a private key.
    const change = changeAddrFromMnemonic(SEND_MNEMONIC)

    // Generate a keypair from the change address.
    const keyPair = BITBOX.HDNode.toKeyPair(change)

    // Sign the transaction with the HD node.
    let redeemScript
    transactionBuilder.sign(
      0,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    )

    // build tx
    const tx = transactionBuilder.build()
    // output rawhex
    const hex = tx.toHex()
    // console.log(`Transaction raw hex: `);
    // console.log(`${hex}`);

    // sendRawTransaction to running BCH node
    const broadcast = await BITBOX.RawTransactions.sendRawTransaction(hex)
    console.log(`Transaction ID: ${broadcast}`)

    console.log(`...Ending sendBch()`)
  } catch (err) {
    console.log(`Error in sendBch: `, err)
    throw err
  }
}

// Generate a change address from a Mnemonic of a private key.
function changeAddrFromMnemonic (mnemonic) {
  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

  // master HDNode
  let masterHDNode
  if (config.NETWORK === `testnet`) {
    masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'testnet')
  } else {
    masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)
  }

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  // derive the first external change address HDNode which is going to spend utxo
  const change = BITBOX.HDNode.derivePath(account, '0/0')

  return change
}

// Get the balance in BCH of a BCH address.
async function getBCHBalance (addr, verbose) {
  try {
    const result = await BITBOX.Address.details([addr])

    if (verbose) console.log(result)

    const bchBalance = result[0]

    return bchBalance.balance
  } catch (err) {
    console.error(`Error in getBCHBalance: `, err)
    console.log(`addr: ${addr}`)
    throw err
  }
}
