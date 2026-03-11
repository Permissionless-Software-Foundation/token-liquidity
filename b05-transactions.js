/*
  Unit and integration tests for bch.js library.

  TODO:
  - Fix unit test for only2Conf()
*/

'use strict'

import { assert } from 'chai'
import sinon from 'sinon'
import nock from 'nock'
import cloneDeep from 'lodash.clonedeep'

import Transactions from './src/adapters/transactions.js'

// const bitboxMock = require('bitbox-mock')
import txMockDataLib from './test/unit/mocks/transactions.mock.js'

// Used for debugging.
import util from 'util'
let mockData
util.inspect.defaultOptions = { depth: 1 }

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'
if (!process.env.TEST_ENV) process.env.TEST_ENV = 'unit'
// const REST_URL = `https://trest.bitcoin.com/v2/`

describe('#transactions', () => {
  let sandbox
  let uut

  before(() => {})

  beforeEach(() => {
    uut = new Transactions()
    mockData = cloneDeep(txMockDataLib)

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    sandbox = sinon.createSandbox()

    // Activate nock if it's inactive.
    if (!nock.isActive()) nock.activate()
  })

  afterEach(() => {
    // Clean up HTTP mocks.
    nock.cleanAll() // clear interceptor list.
    nock.restore()

    sandbox.restore()
  })

  describe('#getTxConfirmations', () => {
    it('should throw an error if input is not an array', async () => {
      try {
        const txids = 'bad-data'

        await uut.getTxConfirmations(txids)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'txids needs to be an array')
      }
    })

    it('should get confirmation information about a tx', async () => {
      // If unit test, use the mocking library instead of live calls.
      if (process.env.TEST_ENV === 'unit') {
        sandbox.stub(uut.bchjs.RawTransactions, 'getRawTransaction').resolves([
          {
            txid:
              '83147001c579d0c3f3150fc733c43af602e44fa157de9bbd74aa0d47062e55f5',
            confirmations: 55
          }
        ])
      }

      const txids = [
        '83147001c579d0c3f3150fc733c43af602e44fa157de9bbd74aa0d47062e55f5'
      ]

      const result = await uut.getTxConfirmations(txids)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.hasAllKeys(result[0], ['txid', 'confirmations'])
    })
  })

  // describe('getUserAddr', () => {
  //   it('should should throw an error for an invalid transaction', async () => {
  //     try {
  //       // If unit test, use the mocking library instead of live calls.
  //       if (process.env.TEST_ENV === 'unit') {
  //         sandbox.stub(uut.bchjs.Blockbook, 'tx').throws({
  //           error: 'txid must be of length 64 (not 59)'
  //         })
  //       }
  //
  //       const txid =
  //         'cf1b5d374e171876a625599a489a2a6cdda119fb84b6cff2a226c39e189'
  //
  //       await uut.getUserAddr(txid)
  //       // console.log(`result: ${util.inspect(result)}`)
  //
  //       assert(true, false, 'Unexpected result')
  //     } catch (err) {
  //       // console.log(`err: `, err)
  //
  //       assert.hasAllKeys(err, ['error'])
  //       assert.isString(err.error)
  //     }
  //   })
  //
  //   it('should return senders cash address', async () => {
  //     // If unit test, use the mocking library instead of live calls.
  //     if (process.env.TEST_ENV === 'unit') {
  //       sandbox
  //         .stub(uut.bchjs.Blockbook, 'tx')
  //         .resolves(mockData.mockTransactions)
  //     }
  //
  //     const txid =
  //       'af30cc46356378cb5f139fb9da301d3b06a50416eb5030e3d397d6c3c027a26d'
  //
  //     const senderAddr = await uut.getUserAddr(txid)
  //     // console.log(`senderAddr: ${util.inspect(senderAddr)}`)
  //
  //     assert.isString(senderAddr)
  //     assert.equal(
  //       senderAddr,
  //       'bchtest:qpyrwjq5c8euxyuwyqqdt40qf00dkfw02q6aqhm2wt'
  //     )
  //   })
  // })

  describe('#getUserAddr2', () => {
    it('should get the sender of a transaction', async () => {
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .onCall(0)
        .resolves(mockData.mockTxSender)
        .onCall(1)
        .resolves(mockData.mockPreTx)

      const txid = '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d'

      const result = await uut.getUserAddr2(txid)
      console.log(`result: ${JSON.stringify(result, null, 2)}`)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.bchjs.RawTransactions, 'getRawTransaction').rejects(new Error('test error'))

        const txid = '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d'

        await uut.getUserAddr2(txid)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
