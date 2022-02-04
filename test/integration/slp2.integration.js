/*
  Integration tests for the slp2.js library
*/

const assert = require('chai').assert

const config = require('../../config')

const SLP2 = require('../../src/lib/slp2')
const slp2 = new SLP2(config)

describe('#slp2', () => {
  describe('#getTokenBalance', () => {
    it('should get token balance', async () => {
      const tokenBalance = await slp2.getTokenBalance()
      // console.log(`tokenBalance: ${JSON.stringify(tokenBalance, null, 2)}`);

      assert.isNumber(tokenBalance)
    })
  })
})
