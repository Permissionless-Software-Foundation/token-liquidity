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

  describe('#txDetails', () => {
    it('should get details on a valid token TX', async () => {
      const txid =
        '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d'

      const result = await slp2.txDetails(txid)
      // console.log("result: ", result);

      assert.equal(result.isValidSlp, true)
    })

    it('should return false for a non-token TX', async () => {
      const txid =
        '0f6437b605393fe5bf851ac667b764fc755f1a906277c0fb098f474e9fb0b89d'

      const result = await slp2.txDetails(txid)
      // console.log("result: ", result);

      assert.equal(result, false)
    })
  })

  describe('#tokenTxInfo', () => {
    it('should return quantity of valid token TX', async () => {
      const txid =
        '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d'

      const result = await slp2.tokenTxInfo(txid)
      // console.log(retokenTxInfosult);

      assert.equal(result, 10)
    })

    it('should return false for non-token TX', async () => {
      const txid =
        '09973ed87744e81516e60718883c46892fec8c7bf825ddb5f4075fb677c631b9'

      const result = await slp2.tokenTxInfo(txid)
      // console.log(result);

      assert.equal(result, false)
    })

    it('should return false for token tx of other token', async () => {
      const txid =
        '2b3404ba9bf3efd8c11f1c96d484318b436ec757d381fbd623a2314e85a072a5'

      const result = await slp2.tokenTxInfo(txid)
      // console.log(result);

      assert.equal(result, false)
    })
  })
})
