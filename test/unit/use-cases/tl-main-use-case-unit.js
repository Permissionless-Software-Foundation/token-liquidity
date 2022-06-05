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
})
