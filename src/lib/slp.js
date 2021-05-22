/*
  This library exports a class of functions for working with SLP tokens. It
  also wraps the SLP-SDK as slp.slpsdk.
*/

'use strict'

// Used for debugging and iterrogating JS objects.
// const util = require('util')
// util.inspect.defaultOptions = { depth: 5 }

const pRetry = require('p-retry')

// const config = require('../../config')

const TLUtils = require('./util')
const tlUtils = new TLUtils()

// BCH library
const BCH = require('./bch')
// const bch = new BCH()

// Winston logger
const wlogger = require('./wlogger')

let _this

class SLP {
  constructor (config) {
    this.config = config
    // console.log('SLP config: ', this.config)

    this.bchjs = new config.BCHLIB({ restURL: config.MAINNET_REST })

    this.bch = new BCH(config)
    this.tlUtils = tlUtils

    _this = this
  }

  // Get the token balance of an address.
  async getTokenBalance () {
    try {
      wlogger.silly('Enter slp.getTokenBalance()')
      // console.log(`addr: ${addr}`)

      const result = await this.bchjs.SLP.Utils.balancesForAddress(
        this.config.SLP245ADDR
      )
      wlogger.debug('token balance: ', result)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      if (result === 'No balance for this address' || result.length === 0) {
        return 0
      }

      // Get the token information that matches the token-ID for PSF tokens.
      const tokenInfo = result.find(
        token => token.tokenId === this.config.SLP_TOKEN_ID
      )
      console.log(`tokenInfo: ${JSON.stringify(tokenInfo, null, 2)}`)

      return parseFloat(tokenInfo.balance)
    } catch (err) {
      wlogger.error('Error in slp.js/getTokenBalance: ', err)
      throw err
    }
  }

  // Retrieves SLP TX details from rest.bitcoin.com
  async txDetails (txid) {
    try {
      wlogger.silly('Entering slp.txDetails().')

      const txValid = await this.bchjs.SLP.Utils.validateTxid(txid)
      // console.log(`txValid: ${JSON.stringify(txValid, null, 2)}`)

      // Return false if the tx is not a valid SLP transaction.
      if (!txValid[0].valid) return false

      // const result = await rp(options)
      const result = await this.bchjs.SLP.Utils.txDetails(txid)
      // console.log(`txDetails: ${util.inspect(result)}`)

      return result
    } catch (err) {
      // This catch will activate on non-token txs.
      // Leave this commented out.
      // wlogger.error(`Error in slp.js/txDetails(): `, err)
      wlogger.debug('Not a token tx', err)
      throw err
    }
  }

  // Returns a number, representing the token quantity if the TX contains a token
  // transfer. Otherwise returns false.
  async tokenTxInfo (txid) {
    try {
      wlogger.silly('Entering slp.tokenTxInfo().')

      const result = await this.txDetails(txid)
      // console.log(`tokenTxInfo: ${JSON.stringify(result, null, 2)}`)

      // Exit if token transfer is not the PSF token.
      if (result.tokenInfo.tokenIdHex !== this.config.SLP_TOKEN_ID) {
        return false
      }

      let tokens = result.tokenInfo.sendOutputs[1]
      tokens = tokens / Math.pow(10, 8)
      console.log(`tokens transfered: ${tokens}`)

      return tokens
    } catch (err) {
      // Dev Note: A non-token tx will trigger this error handler.

      // console.log(`err: ${util.inspect(err)}`)
      return false
    }
  }

  // Craft a SLP token TX.
  // Sends tokens from the address on the 'path' derivation, but pays miner fees
  // from the 145 address.
  // path should equal 245 for normal tokens sends to users.
  // path should equal 145 for transfering tokens from 145 to 245 address.
  async createTokenTx (addr, qty, path) {
    try {
      // console.log(`path: ${path}`)
      if (path !== 145 && path !== 245) {
        throw new Error('path must have a value of 145 or 245')
      }

      if (isNaN(Number(qty)) || Number(qty) <= 0) {
        throw new Error('qty must be a positive number.')
      }

      // Open the wallet controlling the tokens
      const walletInfo = _this.tlUtils.openWallet()
      const mnemonic = walletInfo.mnemonic

      // root seed buffer
      const rootSeed = await this.bchjs.Mnemonic.toSeed(mnemonic)

      // master HDNode
      let masterHDNode
      if (this.config.NETWORK === 'mainnet') {
        masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed)
      } else masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed, 'testnet') // Testnet

      // BEGIN - Get BCH to UTXO to pay transaction

      // Account path 145 to pay for bch miner fees
      const accountBCH = this.bchjs.HDNode.derivePath(
        masterHDNode,
        "m/44'/145'/0'"
      )

      const changeBCH = this.bchjs.HDNode.derivePath(accountBCH, '0/0')

      // Generate an EC key pair for signing the transaction.
      const keyPairBCH = this.bchjs.HDNode.toKeyPair(changeBCH)

      const cashAddressBCH = this.bchjs.HDNode.toCashAddress(changeBCH)
      // console.log(`cashAddressBCH: ${JSON.stringify(cashAddressBCH, null, 2)}`)

      // Utxos from address derivation 145
      // const utxosBCH = await this.bchjs.Blockbook.utxo(cashAddressBCH)
      const fulcrumResult = await this.bchjs.Electrumx.utxo(cashAddressBCH)
      const utxosBCH = fulcrumResult.utxos
      // console.log(`utxosBCH: ${JSON.stringify(utxosBCH, null, 2)}`)

      if (utxosBCH.length === 0) {
        throw new Error('Wallet does not have a BCH UTXO to pay miner fees.')
      }

      // Choose a BCH UTXO to pay for the transaction.
      const bchUtxo = await this.bch.findBiggestUtxo(utxosBCH)
      // console.log(`bchUtxo: ${JSON.stringify(bchUtxo, null, 2)}`)

      // Add Insight property that is missing from Blockbook.
      bchUtxo.satoshis = Number(bchUtxo.value)

      // END - Get BCH to UTXO to pay transaction

      // BEGIN - Get token UTXOs for SLP transaction

      // HDNode of BIP44 account
      const account = this.bchjs.HDNode.derivePath(
        masterHDNode,
        `m/44'/${path}'/0'`
      )

      const change = this.bchjs.HDNode.derivePath(account, '0/0')

      // Generate an EC key pair for signing the transaction.
      const keyPair = this.bchjs.HDNode.toKeyPair(change)

      // get the cash address
      const cashAddress = this.bchjs.HDNode.toCashAddress(change)
      const slpAddress = this.bchjs.HDNode.toSLPAddress(change)
      // console.log(`cashAddress: ${JSON.stringify(cashAddress, null, 2)}`)

      // Get UTXOs held by this address. Derivation 245
      // const utxos = await this.bchjs.Blockbook.utxo(cashAddress)
      const fulcrumResult2 = await this.bchjs.Electrumx.utxo(cashAddress)
      const utxos = fulcrumResult2.utxos
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      if (utxos.length === 0) {
        throw new Error('No token UTXOs to spend! Exiting.')
      }

      // Identify the SLP token UTXOs.
      let tokenUtxos = await this.bchjs.SLP.Utils.tokenUtxoDetails(utxos)
      // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

      // Filter out the token UTXOs that match the user-provided token ID.
      tokenUtxos = tokenUtxos.filter((utxo, index) => {
        if (utxo && utxo.tokenId === this.config.SLP_TOKEN_ID && utxo.isValid) {
          return true
        }

        return false
      })
      // console.log(
      //   `tokenUtxos (filter 1): ${JSON.stringify(tokenUtxos, null, 2)}`
      // )

      // Further filter out the invalid token UTXOs
      for (let i = 0; i < tokenUtxos.length; i++) {
        const thisUtxos = tokenUtxos[i]

        // Ask the full node to validate the UTXO.
        // This is caused by stale data in the indexer. Use getTxOut to ask the
        // full node to validate each UTXO.
        const isValidUtxo = await this.bchjs.Blockchain.getTxOut(
          thisUtxos.tx_hash,
          thisUtxos.tx_pos
        )
        // console.log(`isValidUtxo: ${JSON.stringify(isValidUtxo, null, 2)}`)

        // Delete the current element from the array if the UTXO is not valid.
        if (isValidUtxo === null) {
          tokenUtxos.splice(i, 1)
        }
      }
      // console.log(
      //   `tokenUtxos (filter 2): ${JSON.stringify(tokenUtxos, null, 2)}`
      // )

      // Bail out if no token UTXOs are found.
      if (tokenUtxos.length === 0) {
        throw new Error('No token UTXOs are available!')
      }

      // Generate the OP_RETURN code.
      // console.log(`qty: ${qty}`)
      // const slpSendObj = this.bchjs.SLP.TokenType1.generateSendOpReturn(
      //   tokenUtxos,
      //   Number(qty)
      // )
      // const slpData = this.bchjs.Script.encode(slpSendObj.script)
      // console.log(`slpOutputs: ${slpSendObj.outputs}`)

      const {
        script,
        outputs
      } = this.bchjs.SLP.TokenType1.generateSendOpReturn(
        tokenUtxos,
        Number(qty)
      )

      // END - Get token UTXOs for SLP transaction

      // BEGIN transaction construction.

      // console.log(`config.NETWORK: ${config.NETWORK}`)
      // console.log(`bchUtxo: ${JSON.stringify(bchUtxo, null, 2)}`)
      // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

      // instance of transaction builder
      let transactionBuilder
      if (this.config.NETWORK === 'mainnet') {
        transactionBuilder = new this.bchjs.TransactionBuilder()
      } else transactionBuilder = new this.bchjs.TransactionBuilder('testnet')

      // Add the BCH UTXO as input to pay for the transaction.
      const originalAmount = Number(bchUtxo.value)
      transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)

      // add each token UTXO as an input.
      for (let i = 0; i < tokenUtxos.length; i++) {
        transactionBuilder.addInput(tokenUtxos[i].tx_hash, tokenUtxos[i].tx_pos)
      }

      // TODO: Create fee calculator like slpjs
      // get byte count to calculate fee. paying 1 sat
      // Note: This may not be totally accurate. Just guessing on the byteCount size.
      // const byteCount = this.BITBOX.BitcoinCash.getByteCount(
      //   { P2PKH: 3 },
      //   { P2PKH: 5 }
      // )
      // //console.log(`byteCount: ${byteCount}`)
      // const satoshisPerByte = 1.1
      // const txFee = Math.floor(satoshisPerByte * byteCount)
      // console.log(`txFee: ${txFee} satoshis\n`)
      const txFee = 500

      // amount to send back to the sending address.
      // It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - txFee - 546 * 2

      // console.log(`originalAmount: ${originalAmount}`)
      // console.log(`remainder: ${remainder}`)

      if (remainder < 546) {
        throw new Error('Selected UTXO does not have enough satoshis')
      }
      // console.log(`remainder: ${remainder}`)

      // Add OP_RETURN as first output.
      transactionBuilder.addOutput(script, 0)

      // Send dust transaction representing tokens being sent.
      transactionBuilder.addOutput(
        this.bchjs.SLP.Address.toLegacyAddress(addr),
        546
      )

      // Return token change back to the token-liquidity app.
      if (outputs > 1) {
        transactionBuilder.addOutput(
          this.bchjs.SLP.Address.toLegacyAddress(slpAddress),
          546
        )
      }

      // Last output: send the BCH change back to the wallet.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(cashAddressBCH),
        remainder
      )

      // Sign the transaction with the private key for the BCH UTXO paying the fees.
      let redeemScript
      transactionBuilder.sign(
        0,
        keyPairBCH,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      )

      // Sign each token UTXO being consumed.
      for (let i = 0; i < tokenUtxos.length; i++) {
        const thisUtxo = tokenUtxos[i]

        transactionBuilder.sign(
          1 + i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          Number(thisUtxo.value)
        )
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      // console.log(`Transaction raw hex: `, hex)

      // END transaction construction.

      return hex
    } catch (err) {
      wlogger.error(`Error in createTokenTx: ${err.message}`, err)
      console.error('Error in createTokenTx(): ', err)

      // if (err.message) throw new Error(err.message)
      // else throw new Error('Error in createTokenTx()')
      throw err
    }
  }

  // Craft a SLP token TX to burn a quantity of tokens.
  // Sends tokens from the 245 address, but pays miner fees from the 145 address.
  async burnTokenTx (burnQty) {
    try {
      if (isNaN(Number(burnQty)) || Number(burnQty) <= 0) {
        throw new Error('burn quantity must be a positive number.')
      }

      // Open the wallet controlling the tokens
      const walletInfo = _this.tlUtils.openWallet()
      const mnemonic = walletInfo.mnemonic

      // root seed buffer
      const rootSeed = await this.bchjs.Mnemonic.toSeed(mnemonic)

      // master HDNode
      let masterHDNode
      if (this.config.NETWORK === 'mainnet') {
        masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed)
      } else masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed, 'testnet') // Testnet

      // BEGIN - Get BCH to UTXO to pay transaction

      // Account path 145 to pay for bch miner fees
      const accountBCH = this.bchjs.HDNode.derivePath(
        masterHDNode,
        "m/44'/145'/0'"
      )

      const changeBCH = this.bchjs.HDNode.derivePath(accountBCH, '0/0')

      // Generate an EC key pair for signing the transaction.
      const keyPairBCH = this.bchjs.HDNode.toKeyPair(changeBCH)

      const cashAddressBCH = this.bchjs.HDNode.toCashAddress(changeBCH)
      // console.log(`cashAddressBCH: ${JSON.stringify(cashAddressBCH, null, 2)}`)

      // Utxos from address derivation 145
      // const utxosBCH = await this.bchjs.Blockbook.utxo(cashAddressBCH)
      const fulcrumResult = await this.bchjs.Electrumx.utxo(cashAddressBCH)
      const utxosBCH = fulcrumResult.utxos
      // console.log(`utxosBCH: ${JSON.stringify(utxosBCH, null, 2)}`)

      if (utxosBCH.length === 0) {
        throw new Error('Wallet does not have a BCH UTXO to pay miner fees.')
      }

      // Choose a BCH UTXO to pay for the transaction.
      const bchUtxo = await this.bch.findBiggestUtxo(utxosBCH)
      // console.log(`bchUtxo: ${JSON.stringify(bchUtxo, null, 2)}`)

      // Add Insight property that is missing from Blockbook.
      bchUtxo.satoshis = Number(bchUtxo.value)

      // END - Get BCH to UTXO to pay transaction

      // BEGIN - Get token UTXOs for SLP transaction

      // HDNode of BIP44 account
      const account = this.bchjs.HDNode.derivePath(
        masterHDNode,
        "m/44'/245'/0'"
      )

      const change = this.bchjs.HDNode.derivePath(account, '0/0')

      // Generate an EC key pair for signing the transaction.
      const keyPair = this.bchjs.HDNode.toKeyPair(change)

      // get the cash address
      const cashAddress = this.bchjs.HDNode.toCashAddress(change)
      // const slpAddress = this.bchjs.HDNode.toSLPAddress(change)
      // console.log(`cashAddress: ${JSON.stringify(cashAddress, null, 2)}`)

      // Get UTXOs held by this address. Derivation 245
      // const utxos = await this.bchjs.Blockbook.utxo(cashAddress)
      const fulcrumResult2 = await this.bchjs.Electrumx.utxo(cashAddress)
      const utxos = fulcrumResult2.utxos
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      if (utxos.length === 0) {
        throw new Error('No token UTXOs to spend! Exiting.')
      }

      // Identify the SLP token UTXOs.
      let tokenUtxos = await this.bchjs.SLP.Utils.tokenUtxoDetails(utxos)
      // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

      // Filter out the token UTXOs that match the user-provided token ID.
      tokenUtxos = tokenUtxos.filter((utxo, index) => {
        if (utxo && utxo.tokenId === this.config.SLP_TOKEN_ID && utxo.isValid) {
          return true
        }

        return false
      })
      // console.log(
      //   `tokenUtxos (filter 1): ${JSON.stringify(tokenUtxos, null, 2)}`
      // )

      // Further filter out the invalid token UTXOs.
      // This is caused by stale data in the indexer. Use getTxOut to ask the
      // full node to validate each UTXO.
      for (let i = 0; i < tokenUtxos.length; i++) {
        const thisUtxos = tokenUtxos[i]

        // Ask the full node to validate the UTXO.
        const isValidUtxo = await this.bchjs.Blockchain.getTxOut(
          thisUtxos.tx_hash,
          thisUtxos.tx_pos
        )
        // console.log(`isValidUtxo: ${JSON.stringify(isValidUtxo, null, 2)}`)

        // Delete the current element from the array if the UTXO is not valid.
        if (isValidUtxo === null) {
          tokenUtxos.splice(i, 1)
        }
      }

      // Bail out if no token UTXOs are found.
      if (tokenUtxos.length === 0) {
        throw new Error('No token UTXOs are available!')
      }

      // Generate the OP_RETURN code.
      // console.log(`burnQty: ${burnQty}`)
      const script = this.bchjs.SLP.TokenType1.generateBurnOpReturn(
        tokenUtxos,
        Number(burnQty)
        // TODO: research this call and make sure I'm passing the right qty.
      )
      const slpData = this.bchjs.Script.encode(script)
      // console.log(`slpOutputs: ${slpSendObj.outputs}`)

      // END - Get token UTXOs for SLP transaction

      // BEGIN transaction construction.

      // instance of transaction builder
      let transactionBuilder
      if (this.config.NETWORK === 'mainnet') {
        transactionBuilder = new this.bchjs.TransactionBuilder()
      } else transactionBuilder = new this.bchjs.TransactionBuilder('testnet')

      // Add the BCH UTXO as input to pay for the transaction.
      const originalAmount = Number(bchUtxo.value)
      transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)

      // add each token UTXO as an input.
      for (let i = 0; i < tokenUtxos.length; i++) {
        transactionBuilder.addInput(tokenUtxos[i].tx_hash, tokenUtxos[i].tx_pos)
      }

      // TODO: Create fee calculator like slpjs
      // get byte count to calculate fee. paying 1 sat
      // Note: This may not be totally accurate. Just guessing on the byteCount size.
      // const byteCount = this.BITBOX.BitcoinCash.getByteCount(
      //   { P2PKH: 3 },
      //   { P2PKH: 5 }
      // )
      // //console.log(`byteCount: ${byteCount}`)
      // const satoshisPerByte = 1.1
      // const txFee = Math.floor(satoshisPerByte * byteCount)
      // console.log(`txFee: ${txFee} satoshis\n`)
      const txFee = 500

      // amount to send back to the sending address.
      // It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - txFee - 546 * 2

      // console.log(`originalAmount: ${originalAmount}`)
      // console.log(`remainder: ${remainder}`)

      if (remainder < 546) {
        throw new Error('Selected UTXO does not have enough satoshis')
      }
      // console.log(`remainder: ${remainder}`)

      // Add OP_RETURN as first output.
      transactionBuilder.addOutput(slpData, 0)

      // Send dust transaction representing tokens being sent.
      transactionBuilder.addOutput(
        this.bchjs.SLP.Address.toLegacyAddress(this.config.SLP_ADDR),
        546
      )

      // Last output: send the BCH change back to the wallet.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(this.config.BCH_ADDR),
        remainder
      )

      // Sign the transaction with the private key for the BCH UTXO paying the fees.
      let redeemScript
      transactionBuilder.sign(
        0,
        keyPairBCH,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      )

      // Sign each token UTXO being consumed.
      for (let i = 0; i < tokenUtxos.length; i++) {
        const thisUtxo = tokenUtxos[i]

        transactionBuilder.sign(
          1 + i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          Number(thisUtxo.value)
        )
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      // console.log(`Transaction raw hex: `, hex)

      // END transaction construction.

      return hex
    } catch (err) {
      // console.error(err)
      wlogger.error(`Error in burnTokenTx: ${err.message}`, err)
      // if (err.message) throw new Error(err.message)
      // else {
      //   console.log('Error in slp.js/burnTokenTx: ', err)
      //   throw new Error('Error in burnTokenTx')
      // }

      throw err
    }
  }

  // Broadcast the SLP transaction to the BCH network.
  async broadcastTokenTx (hex) {
    try {
      const txidStr = await this.bchjs.RawTransactions.sendRawTransaction([hex])
      wlogger.info(`Transaction ID: ${txidStr}`)

      return txidStr
    } catch (err) {
      wlogger.error('Error in slp.js/broadcastTokenTx(): ', err)

      // Handle messages from the full node.
      if (err.error) throw new Error(err.error)

      throw err
    }
  }

  // This function wraps the create and broadcast token TX functions with the
  // p-retry library. This is used to move tokens from the 145 path to the 245
  // path. This will allow it to try mutliple times in the event of an error.
  async moveTokens (obj) {
    try {
      // Update global var with obj
      // This is because the function that executes the p-retry library
      // cannot pass attributes as parameters
      // _this.setObjProcessTx(obj)

      if (!obj) throw new Error('obj is undefined')

      const result = await pRetry(
        async () => {
          return await _this.sendTokensFrom145To245(obj)
        },
        {
          onFailedAttempt: this.handleMoveTokenError,
          retries: 5 // Retry 5 times
        }
      )

      return result
    } catch (error) {
      wlogger.error('Error in slp.js/moveTokens(): ', error)
      throw error
      // console.log(error)
    }
  }

  async handleMoveTokenError (error) {
    try {
      const errorMsg = `Attempt ${error.attemptNumber} to send tokens to the 245 path failed. There are ${error.retriesLeft} retries left. Waiting 4 minutes before trying again.`

      //   failed attempt.
      console.log(' ')
      console.log(errorMsg)
      console.log(' ')
      wlogger.error(errorMsg)

      if (process.env.TL_ENV !== 'test') {
        await _this.tlUtils.sleep(60000 * 4)
      } // Sleep for 4 minutes
    } catch (err) {
      console.log(
        'Unhandled error caught in handleMoveTokenError(). Continuing. Error: ',
        err
      )
    }
  }

  // This function is used by moveTokens() to transfer the tokens from the 145
  // public address of the app to the 245 address that holds the token UTXOs.
  async sendTokensFrom145To245 (obj) {
    try {
      // Send the user's tokens to the apps token address on the 245
      // derivation path.
      const tokenConfig = await _this.createTokenTx(
        this.config.SLP_ADDR,
        obj.tokenQty,
        145
      )

      const tokenTXID = await _this.broadcastTokenTx(tokenConfig)

      wlogger.info(
        `Newly recieved tokens sent to 245 derivation path: ${tokenTXID}`
      )

      return tokenTXID
    } catch (err) {
      wlogger.error('Error in slp.js/sendTokensFrom145To245(): ', err)
      throw err
    }
  }
}

module.exports = SLP
