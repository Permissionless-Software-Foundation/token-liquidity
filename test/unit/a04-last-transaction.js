/*
  Unit and integration tests for last-transaction.js library.
*/

'use strict'

const assert = require('chai').assert
const BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const lib = require('../../src/utils/last-transaction')
const { bitboxMock } = require('./mocks/bitbox')

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'

describe('util', () => {
  let BITBOX

  before(() => {})

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    if (process.env.APP_ENV === 'test') BITBOX = bitboxMock
    else BITBOX = new BITBOXSDK({ restURL: 'https://trest.bitcoin.com/v1/' })

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
  })

  describe('getTransactions', () => {
    it('should get transactions associated with an address', async () => {
      const addr = 'bchtest:qqafk2cvztl8yt70v5akaawucwrn94hl2yups7rzfn'

      const txids = await lib.getTransactions(addr, BITBOX)
      // console.log(`txids: ${util.inspect(txids)}`)

      assert.hasAllKeys(txids, ['pagesTotal', 'txs'])
      assert.isArray(txids.txs)
    })
  })

  describe('getTxConfs', () => {
    it('throws error for non-array input', () => {
      try {
        const badData = 'some non-array'

        lib.getTxConfs(badData)

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        // console.log(util.inspect(err))
        assert.include(err.message, 'txdata needs to be an array', 'Expected error message')
      }
    })

    it('should return a sorted array of txids and confirmations', async () => {
      const addr = 'bchtest:qqafk2cvztl8yt70v5akaawucwrn94hl2yups7rzfn'
      const txids = await lib.getTransactions(addr, BITBOX)

      const result = lib.getTxConfs(txids.txs)
      // console.log(`result: ${util.inspect(result)}`)

      assert.isArray(result)
      assert.hasAllKeys(result[0], ['txid', 'confirmations'])
      assert.isString(result[0].txid)
      assert.isNumber(result[0].confirmations)

      // Validate sorting
      const firstConf = result[0].confirmations
      const lastConf = result[result.length - 1].confirmations
      assert.equal(firstConf < lastConf, true, 'Expected in sorted order')
    })
  })
})
