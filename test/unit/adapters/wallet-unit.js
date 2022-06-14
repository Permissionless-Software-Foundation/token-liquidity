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

  describe('#getBalances', () => {
    it('should get the balance of BCH and tokens', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'getUtxos').resolves()
      sandbox.stub(uut.wallet, 'getBalance').resolves(1796675)
      sandbox.stub(uut.wallet, 'listTokens').resolves([
        {
          tokenId: 'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
          ticker: 'TLT',
          name: 'Token Liquidity Test',
          decimals: 8,
          tokenType: 1,
          url: 'https://FullStack.cash',
          qty: 642662.0477689
        }
      ])

      const result = await uut.getBalances()

      assert.property(result, 'sats')
      assert.property(result, 'tokens')
      assert.isArray(result.tokens)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.wallet, 'getUtxos').rejects(new Error('test error'))

        await uut.getBalances()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
