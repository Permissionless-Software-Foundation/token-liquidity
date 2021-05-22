/*
  Integration tests for the transactions.js library.
*/

const assert = require('chai').assert

process.env.NETWORK = 'mainnet'

const Transactions = require('../../src/lib/transactions')
const transactions = new Transactions()

describe('#transactions.js', () => {
  // describe('#getUserAddr', () => {
  //   it('should get the sender of a TX', async () => {
  //     const txid = '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d'
  //
  //     const result = await transactions.getUserAddr(txid)
  //     console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.isString(result)
  //   })
  // })

  describe('#getUserAddr2', () => {
    it('should get the sender of a TX', async () => {
      const txid =
        '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d'

      const result = await transactions.getUserAddr2(txid)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
    })
  })
})
