/*
  Unit tests for the Trade Use Case library.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const Trade = require('../../../src/use-cases/trade')
const adapters = require('../mocks/adapters')
const libMockData = require('../mocks/token-liquidity-mock')

describe('#trade-use-cases', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new Trade({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new Trade()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Trade Use Cases library.'
        )
      }
    })
  })

  describe('#checkForNewTxs', () => {
    it('should signal that new transactions are being detected', async () => {
      sandbox.stub(uut, 'detectNewTxs').resolves(true)

      const result = await uut.checkForNewTxs()

      assert.equal(result, true)
    })
  })

  describe('#detectNewTxs', () => {
    it('should return new txs', async () => {
      const knownTxids = libMockData.knownTxids

      const obj = {
        seenTxs: knownTxids.slice(0, -1)
      }

      // If unit test, use the mocking library instead of live calls.
      sandbox.stub(uut.adapters.bch, 'getTransactions').resolves(libMockData.mockGetTxs)
      sandbox.stub(uut.adapters.txs, 'getTxConfirmations').resolves(libMockData.confs)

      const result = await uut.detectNewTxs(obj)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
    })

    it('should return an empty array if no new txs', async () => {
      const knownTxids = libMockData.knownTxids

      const obj = {
        seenTxs: knownTxids
      }

      // If unit test, use the mocking library instead of live calls.
      sandbox.stub(uut.adapters.bch, 'getTransactions').resolves(libMockData.mockGetTxs)
      sandbox.stub(uut.adapters.txs, 'getTxConfirmations').resolves(libMockData.confs)

      const result = await uut.detectNewTxs(obj)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.equal(result.length, 0)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.adapters.bch, 'getTransactions')
          .rejects(new Error('test error'))

        const knownTxids = libMockData.knownTxids

        const obj = {
          seenTxs: knownTxids
        }

        await uut.detectNewTxs(obj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#processNewTradeTx', () => {
    it('should wrap the auto-retry method', async () => {
      // Mock dependencies
      sandbox.stub(uut.queue, 'add').resolves(true)

      const result = await uut.processNewTradeTx()

      assert.equal(result, true)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.queue, 'add').rejects(new Error('test error'))

        await uut.processNewTradeTx()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleProcessError', () => {
    it('should handle general error', async () => {
      // Prepare mock data
      const error = new Error('test error')
      error.retriesLeft = 2
      uut.timeBetweenRetries = 1

      const result = await uut.handleProcessError(error)

      assert.equal(result, true)
    })

    it('should abort retry for invalid OP_RETURN', async () => {
      try {
        // Prepare mock data
        const error = new Error('Unsupported address format')
        error.retriesLeft = 2
        uut.timeBetweenRetries = 1

        await uut.handleProcessError(error)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Invalid OP_RETURN')
      }
    })

    it('should abort retry for non-PSF token', async () => {
      try {
        // Prepare mock data
        const error = new Error('Dust recieved.')
        error.retriesLeft = 2
        uut.timeBetweenRetries = 1

        await uut.handleProcessError(error)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Dust or non-PSF token')
      }
    })

    it('should abort retry for code 64', async () => {
      try {
        // Prepare mock data
        const error = new Error('code 64')
        error.retriesLeft = 2
        uut.timeBetweenRetries = 1

        await uut.handleProcessError(error)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Exchange aborted because of dust.')
      }
    })

    it('should abort retry for dust', async () => {
      try {
        // Prepare mock data
        const error = new Error('dust')
        error.retriesLeft = 2
        uut.timeBetweenRetries = 1

        await uut.handleProcessError(error)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Exchange aborted because of dust.')
      }
    })

    it('should send email once retries run out', async () => {
      // Prepare mock data
      const error = new Error('test error')
      error.retriesLeft = 0
      uut.timeBetweenRetries = 1
      uut.config.useEmailAlerts = true

      const result = await uut.handleProcessError(error)

      assert.equal(result, true)
    })
  })

  describe('#pRetryProcessTx-function', () => {
    it('should return output from processTx', async () => {
      try {
        // console.log('init test')
        const obj = {
          txid: '14df82e3ec54fa0227531309f7189ed695bafad6f5062407d3a528fbeddc4a09',
          bchBalance: 12.01044695,
          tokenBalance: 1
        }

        sandbox.stub(uut, 'processTx').resolves(libMockData.processTx)

        const result = await uut.pRetryProcessTx(obj)
        assert.hasAllKeys(result, ['txid', 'bchBalance', 'tokenBalance'])
      } catch (error) {
        console.log(error)
        // assert.include(error.message, `Error in "pRetryProcessTx" functions`)
      }
    })

    it('should catch and report errors', async () => {
      // Force desired code path
      sandbox.stub(uut, 'pRetry').rejects(new Error('test error'))

      const result = await uut.pRetryProcessTx()

      assert.equal(result, null)
    })
  })

  describe('#processTx', () => {
    it('should return false if double-spend is detected', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(true)

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      const result = await uut.processTx(tradeObj)

      assert.equal(result, false)
    })

    it('should return null tx originated from app wallet', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      const appAddr = uut.adapters.wallet.wallet.walletInfo.cashAddress
      sandbox.stub(uut.adapters.txs, 'getUserAddr2').resolves(appAddr)

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      const result = await uut.processTx(tradeObj)

      assert.equal(result, null)
    })

    it('should process a token TX and return the TXID', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      sandbox.stub(uut.adapters.txs, 'getUserAddr2').resolves('fake-addr')
      sandbox.stub(uut.adapters.slp, 'tokenTxInfo').resolves(10)
      sandbox.stub(uut, 'exchangeTokensForBCH').returns(0.001)
      sandbox.stub(uut.adapters.wallet.wallet, 'send').resolves(['fake-txid'])

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      const result = await uut.processTx(tradeObj)

      assert.equal(result, 'fake-txid')
    })

    it('should process a BCH TX and return the TXID', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      sandbox.stub(uut.adapters.txs, 'getUserAddr2').resolves('fake-addr')
      sandbox.stub(uut.adapters.slp, 'tokenTxInfo').resolves(false)
      sandbox.stub(uut.adapters.bch, 'recievedBch').resolves(0.001)
      sandbox.stub(uut, 'exchangeBCHForTokens').returns(10)
      sandbox.stub(uut.adapters.wallet, 'sendTokens').resolves(['fake-txid'])

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      const result = await uut.processTx(tradeObj)

      assert.equal(result, 'fake-txid')
    })

    it('should throw an error if bch quantity can not be determined', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      sandbox.stub(uut.adapters.txs, 'getUserAddr2').resolves('fake-addr')
      sandbox.stub(uut.adapters.slp, 'tokenTxInfo').resolves(false)
      sandbox.stub(uut.adapters.bch, 'recievedBch').resolves('abc')
      // sandbox.stub(uut, 'exchangeBCHForTokens').returns(10)
      // sandbox.stub(uut.adapters.wallet, 'sendTokens').resolves(['fake-txid'])

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      try {
        await uut.processTx(tradeObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'bchQty could not be converted to a number.')
      }
    })

    it('should throw an error if dust or other token is recieved', async () => {
      // Force desired code path
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      sandbox.stub(uut.adapters.txs, 'getUserAddr2').resolves('fake-addr')
      sandbox.stub(uut.adapters.slp, 'tokenTxInfo').resolves(false)
      sandbox.stub(uut.adapters.bch, 'recievedBch').resolves(0.00000546)
      // sandbox.stub(uut, 'exchangeBCHForTokens').returns(10)
      // sandbox.stub(uut.adapters.wallet, 'sendTokens').resolves(['fake-txid'])

      // Mock test data
      const tradeObj = {
        txid: 'fake-txid',
        updateState: () => {}
      }

      try {
        await uut.processTx(tradeObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, "Dust recieved. This is probably a token tx that SLPDB doesn't know about.")
      }
    })

    it('should throw an error if txid is not included', async () => {
      try {
        await uut.processTx()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'txid is undefined')
      }
    })
  })

  // Based on the equation-visualizations.ods spreadsheet. These numbers come
  // from the logarithmic part of the curve.
  describe('#exchangeBCHForTokens', () => {
    it('should calculate log values in the spreadsheet 1', () => {
      const inObj = {
        bchQty: 7.86785736,
        state: {
          bchBalance: 4.57890972
        }
      }

      const result = uut.exchangeBCHForTokens(inObj)
      // console.log('result: ', result)

      assert.equal(
        Math.floor(result),
        // 49999,
        24999,
        'Should match spreadsheet'
      )
    })

    // Based on the equation-visualizations.ods spreadsheet. These numbers come
    // from the log part of the curve.
    it('should calculate log values in the spreadsheet 2', () => {
      const inObj = {
        bchQty: 11.81408491,
        state: {
          bchBalance: 112.33224102
        }
      }

      const result = uut.exchangeBCHForTokens(inObj)
      // console.log('result: ', result)

      assert.equal(
        Math.floor(result),
        // 4999,
        2499,
        'Should match spreadsheet'
      )
    })

    // Based on the equation-visualizations.ods spreadsheet. These numbers come
    // from the linear part of the curve.
    it('should calculate linear values in the spreadsheet 3', () => {
      const inObj = {
        bchQty: 25,
        state: {
          bchBalance: 300
        }
      }

      const result = uut.exchangeBCHForTokens(inObj)
      // console.log('result: ', result)

      assert.equal(
        Math.floor(result),
        4999,
        'Should match spreadsheet'
      )
    })

    // Ensures continuity with older version of the token-liquidity app.
    it('should match values on website', () => {
      const inObj = {
        bchQty: 1,
        state: {
          bchBalance: 28.75678834
        }
      }

      const result = uut.exchangeBCHForTokens(inObj)
      // console.log('result: ', result)

      assert.equal(
        Math.floor(result),
        // 1709
        854
      )
    })

    it('should throw error if bchBalance is not defined', async () => {
      try {
        await uut.exchangeBCHForTokens({})
      } catch (error) {
        assert.include(error.message, 'Cannot read')
      }
    })
  })

  // Based on the equation-visualizations.ods spreadsheet. These numbers come
  // from the logarithmic part of the curve.
  describe('exchangeTokensForBCH', () => {
    it('should calculate log values in the spreadsheet', () => {
      const inObj = {
        tokensIn: 50000,
        state: {
          bchBalance: 4.57890972
        }
      }

      const result = uut.exchangeTokensForBCH(inObj)
      // console.log('result: ', result)

      // 4.57 - 1.68 = 2.89
      // assert.isAbove(result, 2.89)
      // assert.isBelow(result, 3)

      assert.isAbove(result, 2.5)
      assert.isBelow(result, 4)
    })

    it('should calculate log values in the spreadsheet', () => {
      const inObj = {
        tokensIn: 5000,
        state: {
          bchBalance: 124.146
        }
      }

      const result = uut.exchangeTokensForBCH(inObj)
      // console.log('result: ', result)

      // 124.146 - 112.332 = 11.814
      // assert.isAbove(result, 11.8)
      // assert.isBelow(result, 12)

      assert.isAbove(result, 22)
      assert.isBelow(result, 23)
    })

    it('should calculate linear values in the spreadsheet', () => {
      const inObj = {
        tokensIn: 5000,
        state: {
          bchBalance: 300
        }
      }

      const result = uut.exchangeTokensForBCH(inObj)
      // console.log('result: ', result)

      // 300 - 275 = 25
      assert.isAbove(result, 25)
      assert.isBelow(result, 26)
    })

    it('should throw error if bchBalance is not defined', async () => {
      try {
        await uut.exchangeTokensForBCH({})
      } catch (error) {
        assert.include(error.message, 'Cannot read')
      }
    })
  })
})
