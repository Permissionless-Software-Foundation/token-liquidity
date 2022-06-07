/*
  Unit tests for the tl-main Use Case library.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const TLMain = require('../../../src/use-cases/tl-main')
const adapters = require('../mocks/adapters')
// const libMockData = require('../mocks/token-liquidity-mock')

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

  describe('#initState', () => {
    it('should initialize the apps state', async () => {
      // Mock dependencies
      sandbox.stub(uut.adapters.wallet.wallet, 'getUsd').resolves(200)

      const result = await uut.initState()

      assert.equal(result, true)
      assert.equal(uut.state.appReady, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.adapters.wallet, 'getBalances').rejects(new Error('test error'))

        await uut.initState()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleNewTx', () => {
    it('should add new TX to the seenTXs array', async () => {
      // Mock dependencies
      uut.dsSleepTime = 1
      // sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves(null)
      sandbox.stub(uut.trade, 'processNewTradeTx').resolves('fake-txid')

      const txid = 'a'

      const result = await uut.handleNewTx(txid)

      assert.equal(result, 'fake-txid')
      assert.include(uut.state.seenTxs, 'a')
    })

    it('should return false if double spend is detected', async () => {
      // Mock dependencies
      uut.dsSleepTime = 1
      sandbox.stub(uut.adapters.wallet.wallet.bchjs.DSProof, 'getDSProof').resolves({ a: 'b' })

      const txid = 'a'

      const result = await uut.handleNewTx(txid)

      assert.equal(result, false)
    })

    it('should throw an error if TXID is not included', async () => {
      try {
        await uut.handleNewTx()

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'txid required when calling handleNewTx()')
      }
    })
  })
})
