/*
  Integration tests for the token-liquidity.js library.
*/

process.env.NETWORK = 'mainnet'

const config = require('../../config')

const TLLib = require('../../src/lib/token-liquidity')
const tlLib = new TLLib()

const BCH = require('../../src/lib/bch')
const bch = new BCH(config)

const assert = require('chai').assert

describe('#token-liquidity.js', () => {
  describe('#detectNewTxs', () => {
    it('should detect a difference in transactions', async () => {
      const historicalTxs = await bch.getTransactions(config.BCH_ADDR)
      const seenTxs = bch.justTxs(historicalTxs)
      // console.log(`seenTxs: ${JSON.stringify(seenTxs, null, 2)}`)

      // Remove a tx from the tx array.
      seenTxs.shift()

      const obj = {
        seenTxs
      }

      const newTxids = await tlLib.detectNewTxs(obj)
      console.log(`newTxids: ${JSON.stringify(newTxids, null, 2)}`)
    })
  })
  describe('#getPrice', () => {
    it('should get the current spot price of BCH/USD ', async () => {
      const currentPrice = await tlLib.getPrice()
      console.log(`currentPrice: ${JSON.stringify(currentPrice, null, 2)}`)

      assert.isString(currentPrice)
    })
  })
  describe('#getBlockchainBalances', () => {
    it('should get the current blockchain balances', async () => {
      const balance = await tlLib.getBlockchainBalances()
      console.log(`balances: ${JSON.stringify(balance, null, 2)}`)

      assert.property(balance, 'bchBalance')
      assert.property(balance, 'tokenBalance')
      assert.isNumber(balance.bchBalance)
      assert.isNumber(balance.tokenBalance)
    })
  })
  describe('#getSpotPrice', () => {
    it('should Returns the "spot price"', async () => {
      const bchBalance = 1
      const usdPerBCH = 0
      const price = await tlLib.getSpotPrice(bchBalance, usdPerBCH)
      console.log(`price: ${JSON.stringify(price, null, 2)}`)

      assert.isNumber(price)
    })
  })
  describe('#getEffectiveTokenBalance', () => {
    it('should Returns the "spot price"', async () => {
      const bchBalance = 1
      const effectiveBalance = await tlLib.getEffectiveTokenBalance(bchBalance)
      console.log(`effectiveBalance: ${JSON.stringify(effectiveBalance, null, 2)}`)

      assert.isNumber(effectiveBalance)
    })
  })
})
