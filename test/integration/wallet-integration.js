/*
  Integration tests for the wallet.js adapter library
*/

import { assert } from 'chai'
import config from '../../config/index.js'
import Wallet from '../../src/adapters/wallet.js'
import FullStack from '../../src/adapters/fullstack-cash.js'

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
