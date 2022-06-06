/*
  Unit tests for the timer Controller library
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const TimerControllers = require('../../../src/controllers/timer-controllers')
const adapters = require('../mocks/adapters')
const UseCases = require('../mocks/use-cases')
const useCases = new UseCases()

describe('#TimerControllers', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new TimerControllers({ adapters, useCases })
  })

  afterEach(() => {
    sandbox.restore()

    clearInterval(uut.state.newTxCheckInterval)
  })

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new TimerControllers()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating Timer Controller libraries.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new TimerControllers({ adapters })

        assert.fail('Unexpected code path')

        // use to prevent complaints from linter.
        console.log('uut: ', uut)
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating Timer Controller libraries.'
        )
      }
    })
  })

  describe('#checkForNewTxs', async () => {
    it('should exit if app is not ready', async () => {
      const result = await uut.checkForNewTxs()

      assert.equal(result, 1)
    })

    it('should exit if there are no new transactions to process', async () => {
      // Set up state for desired code path.
      uut.useCases.tlMain.state.appReady = true

      const result = await uut.checkForNewTxs()

      assert.equal(result, 2)
    })

    it('should process new transactions', async () => {
      // Set up state for desired code path.
      uut.useCases.tlMain.state.appReady = true
      sandbox.stub(uut.useCases.tlMain.trade, 'checkForNewTxs').resolves(['a'])
      sandbox.stub(uut.useCases.tlMain, 'handleNewTx').resolves()
      sandbox.stub(uut.adapters.wallet.bchjs.Util, 'sleep').resolves()

      const result = await uut.checkForNewTxs()

      assert.equal(result, 2)
    })

    it('should handle errors and restore interval', async () => {
      // Force an error
      uut.useCases.tlMain.state.appReady = true
      sandbox.stub(uut.useCases.tlMain.trade, 'checkForNewTxs').rejects(new Error('test error'))

      const result = await uut.checkForNewTxs()

      assert.equal(result, false)
    })
  })
})
