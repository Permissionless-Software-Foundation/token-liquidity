/*
  Unit tests for the fullstack-cash.js adapter library
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const FullStack = require('../../../src/adapters/fullstack-cash')

describe('#FullStack', () => {
  let sandbox
  let uut

  beforeEach(() => {
    uut = new FullStack()

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#getJwt', () => {
    it('should get a JWT token from FullStack.cash', async () => {
      // Mock dependencies
      sandbox.stub(uut.jwtLib, 'register').resolves()
      sandbox.stub(uut.jwtLib, 'validateApiToken').resolves({ isValid: true })

      await uut.getJwt()
      // console.log('result: ', result)

      // Not throwing an error is a pass.
      assert.equal(true, true)
    })

    it('should renew an expired JWT token', async () => {
      // Mock dependencies
      sandbox.stub(uut.jwtLib, 'register').resolves()
      sandbox.stub(uut.jwtLib, 'validateApiToken').resolves({ isValid: false })
      sandbox.stub(uut.jwtLib, 'getApiToken').resolves('fake-token')

      const result = await uut.getJwt()
      // console.log('result: ', result)

      assert.equal(result, 'fake-token')
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.jwtLib, 'register').rejects(new Error('test error'))

        await uut.getJwt()

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })

    it('should return if app is configured to not use JWT API tokens', async () => {
      // Force code path.
      uut.config.getAPITokenAtStartup = false

      const result = await uut.getJwt()

      assert.equal(result, '')
    })
  })
})
