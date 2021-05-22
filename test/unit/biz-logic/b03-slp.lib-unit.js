/*
  Unit and integration tests for slp.js library.
*/

'use strict'

// Public npm libraries.
const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')

// Mocking-data
const slpMockData = require('../mocks/slp.mock')
const mockWallet = require('../mocks/testwallet.json')

// Local libraries.
const config = require('../../../config')
const SLP = require('../../../src/lib/slp')

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.TL_ENV) process.env.TL_ENV = 'test'

describe('#slp-lib', () => {
  let sandbox
  let slpMockDataCopy
  let uut
  let tempConfig

  before(() => {})

  beforeEach(() => {
    uut = new SLP(config)

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    sandbox = sinon.createSandbox()

    slpMockDataCopy = cloneDeep(slpMockData)
    tempConfig = cloneDeep(config)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#constructor', () => {
    it('should use mainnet based on config setting', () => {
      tempConfig.NETWORK = 'mainnet'

      uut = new SLP(tempConfig)

      assert.equal(uut.bchjs.restURL, tempConfig.MAINNET_REST)
    })
  })

  describe('#getTokenBalance', () => {
    it('should get token balance', async () => {
      sandbox.stub(uut.bchjs.SLP.Utils, 'balancesForAddress').resolves([
        {
          balanceString: '100000000',
          slpAddress: 'simpleledger:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqvd9pdcy2',
          tokenId:
            'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
          balance: 100000000,
          decimalCount: 8
        }
      ])

      const tokenBalance = await uut.getTokenBalance()
      // console.log(`tokenBalance: ${JSON.stringify(tokenBalance, null, 2)}`)

      assert.isNumber(tokenBalance)
    })

    it('should return 0 on address with zero balance', async () => {
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'balancesForAddress')
        .resolves('No balance for this address')

      const addr = 'slptest:qzayl9rxxprzst3fnydykx2rt4d746fcqqu0s50c9u'

      const result = await uut.getTokenBalance(addr)

      assert.equal(result, 0)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'balancesForAddress')
          .rejects(new Error('test error'))

        const addr = 'slptest:qzayl9rxxprzst3fnydykx2rt4d746fcqqu0s50c9u'

        await uut.getTokenBalance(addr)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#txDetails', () => {
    it('should return token tx details for a token tx', async () => {
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'validateTxid')
        .resolves([{ valid: true }])

      const testData = {
        txid:
          '61e71554a3dc18158f30d9e8f5c9b6641a789690b32302899f81cbea9fe3bb49',
        version: 2,
        locktime: 0,
        vin: [{}, {}],
        vout: [{}, {}, {}, {}],
        blockhash:
          '0000000095869fd09aaf838a3ab6f49c3c864518dca8f8115942672088bacfdd',
        blockheight: 1286350,
        confirmations: 8997,
        time: 1550269692,
        blocktime: 1550269692,
        valueOut: 0.09998613,
        size: 480,
        valueIn: 0.09999095,
        fees: 0.00000482,
        tokenInfo: {
          versionType: 1,
          transactionType: 'SEND',
          tokenIdHex:
            '7ac7f4bb50b019fe0f5c81e3fc13fc0720e130282ea460768cafb49785eb2796',
          sendOutputs: [Array]
        },
        tokenIsValid: true
      }

      sandbox.stub(uut.bchjs.SLP.Utils, 'txDetails').resolves(testData)

      const txid =
        '61e71554a3dc18158f30d9e8f5c9b6641a789690b32302899f81cbea9fe3bb49'

      const tokenInfo = await uut.txDetails(txid)
      // console.log(`tokenInfo: ${util.inspect(tokenInfo)}`)

      assert.equal(tokenInfo.tokenIsValid, true)
    })

    it('should return false for non-token tx', async () => {
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'validateTxid')
        .resolves([{ valid: false }])

      const txid =
        '6a2a8722fdbf16456f84245f2e74d4a355dac86e6faec9ce062834d1e82f6517'

      const tokenInfo = await uut.txDetails(txid)
      // console.log(`tokenInfo: ${util.inspect(tokenInfo)}`)

      assert.equal(tokenInfo, false)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'validateTxid')
          .rejects(new Error('test error'))

        const txid =
          '6a2a8722fdbf16456f84245f2e74d4a355dac86e6faec9ce062834d1e82f6517'

        await uut.txDetails(txid)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#tokenTxInfo', () => {
    it('should return token quantity for a token tx', async () => {
      // if (process.env.TEST_ENV === 'unit') {
      slpMockDataCopy.tokenTx.tokenInfo.tokenIdHex = config.SLP_TOKEN_ID
      sandbox.stub(uut, 'txDetails').resolves(slpMockDataCopy.tokenTx)
      // }

      const txid =
        '1e217cbb29bc58a945d5ab1e623bd5c4ab63c699052438dbe06f96d8043d2714'

      const tokenInfo = await uut.tokenTxInfo(txid)
      // console.log(`tokenInfo: ${util.inspect(tokenInfo)}`)

      assert.isAbove(tokenInfo, 0, 'Validate token transfer')
    })

    it('should return false for a non-token tx', async () => {
      // if (process.env.TEST_ENV === 'unit') {
      sandbox.stub(uut, 'txDetails').resolves(slpMockDataCopy.nonTokenTx)
      // }

      const txid =
        'c5834f0f29810a6bfa6325ebc5606f043875e5e0454b68b16e5fa343e6f8e8de'

      const tokenInfo = await uut.tokenTxInfo(txid)
      // console.log(`tokenInfo: ${util.inspect(tokenInfo)}`)

      assert.equal(tokenInfo, false, 'Expect false returned for non-token tx')
    })

    it('should return false for a token-tx of a different token type', async () => {
      // if (process.env.TEST_ENV === 'unit') {
      sandbox.stub(uut, 'txDetails').resolves(slpMockDataCopy.otherTokenTx)
      // }

      const txid =
        '37279c7dc81ceb34d12f03344b601c582e931e05d0e552c29c428bfa39d39af3'

      const tokenInfo = await uut.tokenTxInfo(txid)
      // console.log(`tokenInfo: ${util.inspect(tokenInfo)}`)

      assert.equal(
        tokenInfo,
        false,
        'Expect false returned for non-psf token tx'
      )
    })
  })

  describe('#createTokenTx', () => {
    it('should throw an error if there are no BCH UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumEmtpyUtxos)

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(
          err.message,
          'Wallet does not have a BCH UTXO to pay miner fees'
        )
      }
    })

    it('should throw an error if there are no token UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves([false, false])

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'No token UTXOs are available')
      }
    })

    it('should throw an error if there are no valid token UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox.stub(uut.bchjs.Blockchain, 'getTxOut').resolves(null)

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'No token UTXOs are available')
      }
    })

    it('should throw an error if path is zero', async () => {
      try {
        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 0)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'path must have a value of 145 or 245')
      }
    })

    it('should throw an error if qty is 0', async () => {
      try {
        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'

        await uut.createTokenTx(addr, 0, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'qty must be a positive number.')
      }
    })

    it('should generate a transaction hex for mainnet', async () => {
      tempConfig.NETWORK = 'mainnet'

      uut = new SLP(tempConfig)

      // Mock out down-stream dependencies for a unit test.
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
      // sandbox.stub(slp.bchjs.Blockbook, 'utxo').resolves(slpMockData.utxos)
      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(slpMockDataCopy.fulcrumUtxos)
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
        .resolves(slpMockDataCopy.tokenUtxos)
      sandbox
        .stub(uut.bch, 'findBiggestUtxo')
        .resolves(slpMockDataCopy.utxos[0])
      sandbox
        .stub(uut.bchjs.Blockchain, 'getTxOut')
        .resolves(slpMockDataCopy.validUtxo)

      const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'
      const qty = 1

      const result = await uut.createTokenTx(addr, qty, 245)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
      assert.equal(result.indexOf('0200'), 0, 'First part of string matches.')
    })

    it('should throw an error if 245 address has no UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .onCall(0)
          .resolves(slpMockDataCopy.fulcrumUtxos)
          .onCall(1)
          .resolves(slpMockDataCopy.fulcrumEmtpyUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox
          .stub(uut.bchjs.Blockchain, 'getTxOut')
          .resolves(slpMockDataCopy.validUtxo)

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'No token UTXOs to spend! Exiting.')
      }
    })

    it('should throw an error if remainder has less than dust', async () => {
      try {
        // Modify the mock data to force the error for this test.
        slpMockDataCopy.utxos[0].value = '1500'

        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox
          .stub(uut.bchjs.Blockchain, 'getTxOut')
          .resolves(slpMockDataCopy.validUtxo)

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'Selected UTXO does not have enough satoshis'
        )
      }
    })
  })

  describe('#burnTokenTx', () => {
    it('should throw an error if qty is zero', async () => {
      try {
        const qty = 0

        await uut.burnTokenTx(qty)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'burn quantity must be a positive number.')
      }
    })

    it('should throw an error if there are no BCH UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        // sandbox.stub(slp.bchjs.Blockbook, 'utxo').resolves([])
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves({ success: true, utxos: [] })

        const qty = 1

        await uut.burnTokenTx(qty)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        console.log(`err.message: ${err.message}`)
        assert.include(
          err.message,
          'Wallet does not have a BCH UTXO to pay miner fees'
        )
      }
    })

    it('should throw an error if there are no valid token UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox.stub(uut.bchjs.Blockchain, 'getTxOut').resolves(null)

        const qty = 1

        await uut.burnTokenTx(qty)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'No token UTXOs are available')
      }
    })

    it('should generate a transaction hex for testnet', async () => {
      // Mock out down-stream dependencies for a unit test.
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(slpMockDataCopy.fulcrumUtxos)
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
        .resolves(slpMockDataCopy.tokenUtxos)
      sandbox
        .stub(uut.bch, 'findBiggestUtxo')
        .resolves(slpMockDataCopy.utxos[0])
      sandbox
        .stub(uut.bchjs.Blockchain, 'getTxOut')
        .resolves(slpMockDataCopy.validUtxo)

      const qty = 1

      const result = await uut.burnTokenTx(qty)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
      assert.equal(result.indexOf('0200'), 0, 'First part of string matches.')
    })

    it('should generate a transaction hex for mainnet', async () => {
      // Force it to be on mainnet
      tempConfig.NETWORK = 'mainnet'
      tempConfig.SLP_ADDR =
        'simpleledger:qq0qr5aqv6whvjrhfygk7s38qmuglf5sm5ufqqaqm5'
      tempConfig.BCH_ADDR =
        'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      uut = new SLP(tempConfig)

      // Mock out down-stream dependencies for a unit test.
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
      // sandbox.stub(slp.bchjs.Blockbook, 'utxo').resolves(slpMockData.utxos)
      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(slpMockDataCopy.fulcrumUtxos)
      sandbox
        .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
        .resolves(slpMockDataCopy.tokenUtxos)
      sandbox
        .stub(uut.bch, 'findBiggestUtxo')
        .resolves(slpMockDataCopy.utxos[0])
      sandbox
        .stub(uut.bchjs.Blockchain, 'getTxOut')
        .resolves(slpMockDataCopy.validUtxo)

      const qty = 1

      const result = await uut.burnTokenTx(qty)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
      assert.equal(result.indexOf('0200'), 0, 'First part of string matches.')
    })

    it('should throw an error if 245 address has no UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .onCall(0)
          .resolves(slpMockDataCopy.fulcrumUtxos)
          .onCall(1)
          .resolves(slpMockDataCopy.fulcrumEmtpyUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox
          .stub(uut.bchjs.Blockchain, 'getTxOut')
          .resolves(slpMockDataCopy.validUtxo)

        const qty = 1

        await uut.burnTokenTx(qty)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'No token UTXOs to spend! Exiting.')
      }
    })

    it('should throw an error if remainder has less than dust', async () => {
      try {
        // Modify the mock data to force the error for this test.
        slpMockDataCopy.utxos[0].value = '1500'

        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(slpMockDataCopy.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.SLP.Utils, 'tokenUtxoDetails')
          .resolves(slpMockDataCopy.tokenUtxos)
        sandbox
          .stub(uut.bch, 'findBiggestUtxo')
          .resolves(slpMockDataCopy.utxos[0])
        sandbox
          .stub(uut.bchjs.Blockchain, 'getTxOut')
          .resolves(slpMockDataCopy.validUtxo)

        const qty = 1

        await uut.burnTokenTx(qty)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'Selected UTXO does not have enough satoshis'
        )
      }
    })
  })

  describe('#broadcastTokenTx', () => {
    it('should broadcast a tx and return the txid', async () => {
      // Mock out dependency.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        .resolves('txid')

      const hex = '0200...'

      const result = await uut.broadcastTokenTx(hex)

      assert.equal(result, 'txid')
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .rejects(new Error('test error'))

        const hex = '0200...'

        await uut.broadcastTokenTx(hex)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('should catch and throw errors from the full node', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .rejects({ error: 'test error' })

        const hex = '0200...'

        await uut.broadcastTokenTx(hex)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#sendTokensFrom145To245', () => {
    it('should return a txid', async () => {
      sandbox.stub(uut, 'createTokenTx').resolves('aHexString')
      sandbox.stub(uut, 'broadcastTokenTx').resolves('aTxidString')

      const obj = {
        tokenQty: 1
      }

      const result = await uut.sendTokensFrom145To245(obj)

      assert.equal(result, 'aTxidString')
    })

    it('should catch and throw errors', async () => {
      try {
        // Force and error
        sandbox.stub(uut, 'createTokenTx').rejects(new Error('test error'))

        const obj = {
          tokenQty: 1
        }

        await uut.sendTokensFrom145To245(obj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleMoveTokenError', () => {
    it('should report the error information', async () => {
      const errorObj = {
        attemptNumber: 1,
        retriesLeft: 5
      }

      await uut.handleMoveTokenError(errorObj)

      // Simply executing without throwing an error is a pass.
      assert.isOk(true)
    })
  })

  describe('#moveTokens', () => {
    it('should throw error if parameters are not defined', async () => {
      try {
        await uut.moveTokens()

        assert.fail('Unexpected result')
      } catch (error) {
        // console.log('Error: ', error)
        assert.include(error.message, 'obj is undefined')
      }
    })

    it('return the result on success', async () => {
      sandbox.stub(uut, 'sendTokensFrom145To245').resolves('txidString')

      const obj = {
        tokenQty: 1
      }

      const result = await uut.moveTokens(obj)

      assert.equal(result, 'txidString')
    })
  })
})
