/*
  Unit tests for the tl-main Use Case library.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const TLMain = require('../../../src/use-cases/tl-main')
const adapters = require('../mocks/adapters')
const libMockData = require('../mocks/token-liquidity-mock')

describe('#tl-main-use-cases', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new TLMain({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new TLMain()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating token-liquidity Use Cases library.'
        )
      }
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
      assert.hasAllKeys(result[0], ['txid', 'confirmations'])
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

  describe('#getEffectiveTokenBalance()', () => {
    it('should get token balance', async () => {
      const bchBalance = 12.44768481

      const result = await uut.getEffectiveTokenBalance(bchBalance)
      // console.log('result: ', result)

      assert.equal(result, 149996.31356401)
    })

    it('should throw error if bchBalance is not provided', async () => {
      try {
        await uut.getEffectiveTokenBalance()

        assert.fail('Unexpected result')
      } catch (error) {
        assert.include(error.message, 'bchBalance is required')
      }
    })
  })
})
