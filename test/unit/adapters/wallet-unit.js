/*
  Unit tests for the wallet.js adapter library
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const Wallet = require('../../../src/adapters/wallet')

describe('#Wallet', () => {
  let sandbox
  let uut

  beforeEach(() => {
    uut = new Wallet()

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#initWallet', () => {
    it('should throw an error if mnemonic is not passed in', async () => {
      try {
        await uut.initWallet()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Must pass mnemonic when instantiating the Wallet class library.')
      }
    })

    it('should initialize wallet', async () => {
      // Mock dependencies
      const FakeWallet = class FakeWalle {}
      uut.BchWallet = FakeWallet

      const mnemonic = 'drum salute decline increase earth cloth tobacco gospel appear motor fever soft'

      const result = await uut.initWallet(mnemonic)

      assert.equal(result, true)
    })
  })
})
