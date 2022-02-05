/*
  This is a completely refactored version of the original slp.js library.
  This version uses the psf-slp-indexer and minimal-slp-wallet to implement
  a lot of the SLP functionality.
*/

// Public npm libraries
const BchWallet = require('minimal-slp-wallet/index')
const BigNumber = require('bignumber.js')

// Local libraries
const TLUtils = require('./util')
const wlogger = require('./wlogger')

// This constant saves an API call for each UTXO.
const TOKEN_DECIMALS = 8

class SLP {
  constructor (localConfig = {}) {
    // console.log(`localConfig: ${JSON.stringify(localConfig, null, 2)}`);

    // Encapsulate dependencies
    this.config = localConfig
    this.tlUtils = new TLUtils()
    this.walletInfo = this.tlUtils.openWallet()
    // console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`);

    // Determine the environment
    if (!process.env.TL_ENV) process.env.TL_ENV = 'test'

    // Initialize the wallet library
    const advancedOptions = {
      restURL: localConfig.MAINNET_REST,
      apiToken: process.env.BCHJSTOKEN
    }

    // Disable wallet UTXO retrieval if this is a test.
    if (process.env.TL_ENV === 'test') {
      advancedOptions.noUpdate = true
    }

    // Initialize minimal-slp-wallet
    this.bchWallet = new BchWallet(this.walletInfo.mnemonic, advancedOptions)
    this.bchjs = this.bchWallet.bchjs
  }

  async waitForWalletInit () {
    await this.bchWallet.walletInfoPromise
  }

  // Get the balance of the tokens held by the 245 address.
  async getTokenBalance () {
    try {
      wlogger.silly('Enter slp2.getTokenBalance()')

      // console.log(`this.config.SLP_TOKEN_ID: ${this.config.SLP_TOKEN_ID}`);

      await this.waitForWalletInit()

      const result = await this.bchWallet.listTokens(this.config.SLP245ADDR)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`);

      const targetToken = result.filter(
        (x) => x.tokenId === this.config.SLP_TOKEN_ID
      )

      if (targetToken.length === 0) return 0

      return targetToken[0].qty
    } catch (err) {
      wlogger.debug('Error in slp2.js/getTokenBalance: ', err)
      throw err
    }
  }

  // Retrieves SLP TX details
  async txDetails (txid) {
    try {
      wlogger.silly('Entering slp.txDetails().')

      await this.waitForWalletInit()

      const result = await this.bchjs.PsfSlpIndexer.tx(txid)
      const txData = result.txData
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`);

      const isValidSlp = txData.isValidSlp

      // Return false if the tx is not a valid SLP transaction.
      if (!isValidSlp) return false

      return txData
    } catch (err) {
      // This catch will activate on non-token txs.
      // Leave this commented out.
      wlogger.debug('Error in slp2.js/txDetails(): ', err)
      throw err
    }
  }

  // Returns a number, representing the token quantity if the TX contains a token
  // transfer. Otherwise returns false.
  // Assumes that the transfer amount is in the second output (vout[1]).
  async tokenTxInfo (txid) {
    try {
      wlogger.silly('Entering slp.tokenTxInfo().')

      const result = await this.txDetails(txid)
      // console.log(`tokenTxInfo: ${JSON.stringify(result, null, 2)}`);

      // Return false if this is not a valid SLP token.
      if (!result.isValidSlp) return false

      // Return false if this is not a token TX for the selected token.
      if (result.tokenId !== this.config.SLP_TOKEN_ID) return false

      const tokenQty = result.vout[1].tokenQty

      if (!tokenQty) return false

      return tokenQty
    } catch (err) {
      // console.log(`err: ${util.inspect(err)}`)
      wlogger.debug('Error in slp2.js/tokenTxInfo(): ', err)

      // Exit quietly and return false.
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
      const walletInfo = this.tlUtils.openWallet()
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
      // console.log(
      //   `145 cashAddressBCH: ${JSON.stringify(cashAddressBCH, null, 2)}`
      // )

      // Utxos from address derivation 145
      // const utxosBCH = await this.bchjs.Blockbook.utxo(cashAddressBCH)
      const fulcrumResult = await this.bchjs.Electrumx.utxo(cashAddressBCH)
      const utxosBCH = fulcrumResult.utxos
      // console.log(`utxosBCH: ${JSON.stringify(utxosBCH, null, 2)}`)

      if (utxosBCH.length === 0) {
        throw new Error('Wallet does not have a BCH UTXO to pay miner fees.')
      }

      // Choose a BCH UTXO to pay for the transaction.
      const bchUtxo = await this.bchjs.Utxo.findBiggestUtxo(utxosBCH)
      // console.log(`bchUtxo: ${JSON.stringify(bchUtxo, null, 2)}`);

      // Add satoshis property.
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
      // console.log(
      //   `${path} cashAddress: ${JSON.stringify(cashAddress, null, 2)}`
      // )

      const addrData = await this.bchjs.PsfSlpIndexer.balance(cashAddress)
      const addrUtxos = addrData.balance.utxos
      // console.log(`addrUtxos: ${JSON.stringify(addrUtxos, null, 2)}`);

      if (addrUtxos.length === 0) {
        throw new Error('No token UTXOs to spend! Exiting.')
      }

      let tokenUtxos = addrUtxos.filter(
        (x) => x.tokenId === this.config.SLP_TOKEN_ID
      )
      // console.log(
      //   `tokenUtxos (filter 1): ${JSON.stringify(tokenUtxos, null, 2)}`
      // );

      // Bail out if no token UTXOs are found.
      if (tokenUtxos.length === 0) {
        throw new Error('No token UTXOs are available!')
      }

      // Add missing properties to the UTXOs.
      tokenUtxos = tokenUtxos.map((x) => {
        x.tx_hash = x.txid
        x.tx_pos = x.vout
        x.decimals = TOKEN_DECIMALS
        x.tokenQty = new BigNumber(x.qty).dividedBy(10 ** TOKEN_DECIMALS)
        x.tokenQty = x.tokenQty.toString()
        x.value = this.bchjs.BitcoinCash.toSatoshi(x.value)

        return x
      })
      // console.log(`tokenUtxos (2): ${JSON.stringify(tokenUtxos, null, 2)}`);

      const { script, outputs } =
        this.bchjs.SLP.TokenType1.generateSendOpReturn(tokenUtxos, Number(qty))

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
        transactionBuilder.addInput(
          tokenUtxos[i].tx_hash,
          tokenUtxos[i].tx_pos
        )
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
      wlogger.debug(`Error in createTokenTx: ${err.message}`, err)
      // console.error("Error in createTokenTx(): ", err);

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
      const walletInfo = this.tlUtils.openWallet()
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
      const bchUtxo = await this.bchjs.Utxo.findBiggestUtxo(utxosBCH)
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

      const addrData = await this.bchjs.PsfSlpIndexer.balance(cashAddress)
      const addrUtxos = addrData.balance.utxos
      // console.log(`addrUtxos: ${JSON.stringify(addrUtxos, null, 2)}`);

      if (addrUtxos.length === 0) {
        throw new Error('No token UTXOs to spend! Exiting.')
      }

      let tokenUtxos = addrUtxos.filter(
        (x) => x.tokenId === this.config.SLP_TOKEN_ID
      )
      // console.log(
      //   `tokenUtxos (filter 1): ${JSON.stringify(tokenUtxos, null, 2)}`
      // )

      // Bail out if no token UTXOs are found.
      if (tokenUtxos.length === 0) {
        throw new Error('No token UTXOs are available!')
      }

      // Add missing properties to the UTXOs.
      tokenUtxos = tokenUtxos.map((x) => {
        x.tx_hash = x.txid
        x.tx_pos = x.vout
        x.decimals = TOKEN_DECIMALS
        x.tokenQty = new BigNumber(x.qty).dividedBy(10 ** TOKEN_DECIMALS)
        x.tokenQty = x.tokenQty.toString()
        x.value = this.bchjs.BitcoinCash.toSatoshi(x.value)

        return x
      })
      // console.log(`tokenUtxos (2): ${JSON.stringify(tokenUtxos, null, 2)}`);

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
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      // Add the BCH UTXO as input to pay for the transaction.
      const originalAmount = Number(bchUtxo.value)
      transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)

      // add each token UTXO as an input.
      for (let i = 0; i < tokenUtxos.length; i++) {
        transactionBuilder.addInput(
          tokenUtxos[i].tx_hash,
          tokenUtxos[i].tx_pos
        )
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
        this.bchjs.Address.toLegacyAddress(cashAddress),
        546
      )

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
      // console.error(err)
      wlogger.debug(`Error in burnTokenTx: ${err.message}`, err)
      // if (err.message) throw new Error(err.message)
      // else {
      //   console.log('Error in slp.js/burnTokenTx: ', err)
      //   throw new Error('Error in burnTokenTx')
      // }

      throw err
    }
  }
}

module.exports = SLP
