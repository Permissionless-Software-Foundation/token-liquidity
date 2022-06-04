/*
  Unit tests for the Trade Use Case library.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const Trade = require('../../../src/use-cases/trade')
const adapters = require('../mocks/adapters')
// const libMockData = require('../mocks/token-liquidity-mock')

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
    it('placeholder', () => {
      uut.checkForNewTxs()
    })
  })
})
