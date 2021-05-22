/*
  Generates and broadcasts a BCH transaction which includes an OP_RETURN
  including text data in the transaction.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = 'testnet'

// REST API servers.
const MAINNET_API = 'http://api.bchjs.cash/v3/'
const TESTNET_API = 'http://tapi.bchjs.cash/v3/'

// You can generate a WIF (private key) and public address using the
// 'get-key' command of slp-cli-wallet.
const WIF = 'cNbdqUFZLCU5CJoPnDsQsAeXetYSCZuf5XNwfZt2KYGEwo5HLL6V'
const ADDR = 'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd'
const SATS_TO_SEND = 100000

// Customize the message you want to send
const MESSAGE = 'BURN abcdef'

const BCHJS = require('@chris.troutner/bch-js')
let bchjs
if (NETWORK === 'mainnet') bchjs = new BCHJS({ restURL: MAINNET_API })
else bchjs = new BCHJS({ restURL: TESTNET_API })

async function writeOpReturn (msg, wif) {
  try {
    // Create an EC Key Pair from the user-supplied WIF.
    const ecPair = bchjs.ECPair.fromWIF(wif)

    const wifAddr = bchjs.ECPair.toCashAddress(ecPair)

    // Generate the public address that corresponds to this WIF.
    // const addr = bchjs.ECPair.toCashAddress(ecPair)
    const addr = ADDR
    console.log(`Publishing "${msg}" to ${addr}`)

    // Pick a UTXO controlled by this address.
    const utxos = await bchjs.Blockbook.utxo(wifAddr)
    const utxo = await findBiggestUtxo(utxos)

    // instance of transaction builder
    let transactionBuilder
    if (NETWORK === 'mainnet') { transactionBuilder = new bchjs.TransactionBuilder() } else transactionBuilder = new bchjs.TransactionBuilder('testnet')

    const originalAmount = utxo.satoshis
    const vout = utxo.vout
    const txid = utxo.txid

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout)

    // TODO: Compute the 1 sat/byte fee.
    const fee = 500

    // amount to send back to the sending address.
    // It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - SATS_TO_SEND - fee

    if (remainder < 546) throw new Error('Not enough remainder to justify change. Create bigger UTXO.')

    // BEGIN - Construction of OP_RETURN transaction.

    // Add the OP_RETURN to the transaction.
    const script = [
      bchjs.Script.opcodes.OP_RETURN,
      Buffer.from('6d02', 'hex'), // Makes message comply with the memo.cash protocol.
      Buffer.from(`${msg}`)
    ]

    // Compile the script array into a bitcoin-compliant hex encoded string.
    const data = bchjs.Script.encode(script)

    // Add the OP_RETURN output.
    transactionBuilder.addOutput(data, 0)

    // END - Construction of OP_RETURN transaction.

    // Send the same amount - fee.
    transactionBuilder.addOutput(addr, SATS_TO_SEND)

    transactionBuilder.addOutput(wifAddr, remainder)

    // Sign the transaction with the HD node.
    let redeemScript
    transactionBuilder.sign(
      0,
      ecPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    )

    // build tx
    const tx = transactionBuilder.build()

    // output rawhex
    const hex = tx.toHex()
    // console.log(`TX hex: ${hex}`);
    // console.log(` `);

    // Broadcast transation to the network
    const txidStr = await bchjs.RawTransactions.sendRawTransaction(hex)
    console.log(`Transaction ID: ${txidStr}`)
    // console.log(`https://memo.cash/post/${txidStr}`)

    if (NETWORK === 'mainnet') { console.log(`https://explorer.bitcoin.com/bch/tx/${txidStr}`) } else { console.log(`https://explorer.bitcoin.com/tbch/tx/${txidStr}`) }
  } catch (err) {
    console.log('Error in writeOpReturn(): ', err)
  }
}
writeOpReturn(MESSAGE, WIF)

// Returns the utxo with the biggest balance from an array of utxos.
async function findBiggestUtxo (utxos) {
  if (!Array.isArray(utxos)) throw new Error('utxos needs to be an array')

  let largestAmount = 0
  let largestIndex = 0

  for (let i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i]

    if (thisUtxo.satoshis > largestAmount) {
      // Ask the full node to validate the UTXO. Skip if invalid.
      const isValid = await bchjs.Blockchain.getTxOut(thisUtxo.txid, thisUtxo.vout)
      if (isValid === null) continue

      largestAmount = thisUtxo.satoshis
      largestIndex = i
    }
  }

  return utxos[largestIndex]
}
