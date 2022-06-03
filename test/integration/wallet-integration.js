/*
  Integration tests for the wallet.js adapter library
*/

// Global npm libraries
const assert = require('chai').assert

// Local libraries
const config = require('../../config')
const Wallet = require('../../src/adapters/wallet')
const FullStack = require('../../src/adapters/fullstack-cash')

describe('#wallet.js', () => {
  let uut

  beforeEach(async () => {
    const fullstack = new FullStack()
    const apiToken = await fullstack.getJwt()
    uut = new Wallet()
    await uut.initWallet(config.mnemonic, apiToken)
  })

  describe('#getBalances', () => {
    it('should get the balances for the wallet', async () => {
      const result = await uut.getBalances()
      // console.log('result: ', result)

      assert.property(result, 'sats')
      assert.property(result, 'tokens')
      assert.isArray(result.tokens)
    })
  })
})
