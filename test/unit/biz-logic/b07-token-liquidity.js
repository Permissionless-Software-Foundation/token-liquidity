/*
  Unit and integration tests for the token-liquidity.js library
*/

'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const nock = require('nock')

const TokenLiquidity = require('../../../src/lib/token-liquidity')

// const bitboxMock = require('bitbox-mock')
// const txMockData = require('./mocks/transactions')
const libMockData = require('../mocks/token-liquidity-mock')

// Used for debugging.
const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'
if (!process.env.TEST_ENV) process.env.TEST_ENV = 'unit'
// const REST_URL = `https://trest.bitcoin.com/v2/`

describe('#token-liquidity', () => {
  let sandbox
  let lib

  before(() => {})

  beforeEach(() => {
    lib = new TokenLiquidity()

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

  describe('#exchangeTokensForBCH', () => {
    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        tokenIn: 500,
        // tokenBalance: 8500,
        bchBalance: 12.41463259,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const retObj = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      const result = retObj.bchOut

      assert.isNumber(result)
      assert.equal(result, 1.1814112, 'Should match spreadsheet')
    })

    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        tokenIn: 500,
        // tokenBalance: 15000,
        bchBalance: 3.38338208,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const retObj = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      const result = retObj.bchOut

      assert.isNumber(result)
      assert.equal(result, 0.32197408, 'Should match spreadsheet')
    })

    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        tokenIn: 500,
        // tokenBalance: 1000,
        bchBalance: 55.63852321,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const retObj = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      assert.equal(retObj.bchOut, 2.5000027)
      assert.equal(retObj.bch2, 53.13852321)
      assert.equal(retObj.token2, -5627.704642)
    })

    it('should work with negative token balances', () => {
      const exchangeObj = {
        tokenIn: 500,
        // tokenBalance: 1000,
        bchBalance: 50,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const retObj = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      assert.equal(retObj.bchOut, 2.5000027)
      assert.equal(retObj.bch2, 47.5)
      assert.equal(retObj.token2, -4500)
    })

    it('should work with negative token balances', () => {
      const exchangeObj = {
        tokenIn: 500,
        // tokenBalance: 1000,
        bchBalance: 55,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const retObj = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      assert.equal(retObj.bchOut, 2.5000027)
      assert.equal(retObj.bch2, 52.5)
      assert.equal(retObj.token2, -5500.00000001)
    })

    it('should throw error if bchBalance is not defined', async () => {
      try {
        await lib.exchangeTokensForBCH({})
      } catch (error) {
        assert.include(error.message, 'bchBalance must be defined')
      }
    })
  })

  describe('exchangeBCHForTokens', () => {
    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        // bchIn: 1.181410849,
        bchIn: 1.30565831,
        bchBalance: 12.41463259,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const result = lib.exchangeBCHForTokens(exchangeObj)
      // console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ['tokensOut', 'bch2', 'token2'])
      assert.equal(
        Math.floor(result.tokensOut),
        499,
        'Should match spreadsheet'
      )
      assert.isNumber(result.bch2)
      assert.isNumber(result.token2)
    })

    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        bchIn: 5.81360394,
        bchBalance: 3.38338208,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const result = lib.exchangeBCHForTokens(exchangeObj)
      // console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ['tokensOut', 'bch2', 'token2'])
      assert.equal(
        Math.floor(result.tokensOut),
        4999,
        'Should match spreadsheet'
      )
      assert.isNumber(result.bch2)
      assert.isNumber(result.token2)
    })

    it('should throw error if bchBalance is not defined', async () => {
      try {
        await lib.exchangeBCHForTokens({})
      } catch (error) {
        assert.include(error.message, 'bchBalance must be defined')
      }
    })
  })

  describe('#detectNewTxs', () => {
    it('should return new txs', async () => {
      const knownTxids = libMockData.knownTxids

      const obj = {
        seenTxs: knownTxids.slice(0, -1)
      }

      // If unit test, use the mocking library instead of live calls.
      sandbox.stub(lib.bch, 'getTransactions').resolves(libMockData.mockGetTxs)

      sandbox.stub(lib.txs, 'getTxConfirmations').resolves(libMockData.confs)

      const result = await lib.detectNewTxs(obj)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.hasAllKeys(result[0], ['txid', 'confirmations'])
    })

    it('should return an empty array if no new txs', async () => {
      const knownTxids = libMockData.knownTxids

      const obj = {
        seenTxs: knownTxids
      }

      // If unit test, use the mocking library instead of live calls.
      sandbox.stub(lib.bch, 'getTransactions').resolves(libMockData.mockGetTxs)

      sandbox.stub(lib.txs, 'getTxConfirmations').resolves(libMockData.confs)

      const result = await lib.detectNewTxs(obj)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.equal(result.length, 0)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(lib.bch, 'getTransactions')
          .rejects(new Error('test error'))

        const knownTxids = libMockData.knownTxids

        const obj = {
          seenTxs: knownTxids
        }

        await lib.detectNewTxs(obj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#pRetryProcessTx function', () => {
    it('should throw error if parameters are not defined', async () => {
      try {
        await lib.pRetryProcessTx()
      } catch (error) {
        // console.log('Error: ', error)
        assert.include(error.message, 'obj is undefined')
      }
    })

    it('Should return object', async () => {
      try {
        // console.log('init test')
        const obj = {
          txid:
            '14df82e3ec54fa0227531309f7189ed695bafad6f5062407d3a528fbeddc4a09',
          bchBalance: 12.01044695,
          tokenBalance: 1
        }

        sandbox.stub(lib, 'processTx').resolves(libMockData.processTx)

        const result = await lib.pRetryProcessTx(obj)
        assert.hasAllKeys(result, ['txid', 'bchBalance', 'tokenBalance'])
      } catch (error) {
        console.log(error)
        // assert.include(error.message, `Error in "pRetryProcessTx" functions`)
      }
    })
  })

  // Only run these tests for a unit test.
  if (process.env.TEST_ENV === 'unit') {
    describe('compareLastTransaction', () => {
      /*
        it(`should return false if transactions are the same`, async () => {
          const obj = {
            bchAddr: `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`,
            txid: `9f56ba221d862e41f33b564e49ddffc66ec9b5bcaf4669d40e1d890ade4817bc`,
            bchBalance: 25,
            tokenBalance: 5000
          }

          const result = await lib.compareLastTransaction(obj, tknLib, bchLib, BITBOX)
          console.log(`result: ${util.inspect(result)}`)

          assert.equal(result, false, 'return false expected')
        })
        */
      /*
      it('should send BCH in exchange for tokens', async () => {
        const obj = {
          bchAddr: `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`,
          txid: `298e9186a2113443f3b2064ee0bf0ae1973434ae48e9ec3c3e27bfea41d41b05`,
          bchBalance: 7.68905269,
          tokenBalance: 100000
        }

        const result = await lib.compareLastTransaction(obj)
        // console.log(`result: ${util.inspect(result)}`)

        // Should return the last transactions, as well as the new balance of BCH
        // and the token.
        assert.hasAllKeys(result, [
          'lastTransaction',
          'bchBalance'
          // 'tokenBalance'
        ])
      })

      it('should send tokens in exchange for BCH', async () => {
        const obj = {
          bchAddr: `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`,
          txid: `a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9`,
          bchBalance: 7.68905269,
          tokenBalance: 100000
        }
        //

        const result = await lib.compareLastTransaction(obj)
        // console.log(`result: ${util.inspect(result)}`)

        // Should return the last transactions, as well as the new balance of BCH
        // and the token.
        assert.hasAllKeys(result, [
          'lastTransaction',
          'bchBalance'
          // 'tokenBalance'
        ])
      })
      */
    })

    describe('#getCoinbasePrice()', () => {
      it('should get the current price from coinbase api', async () => {
        try {
          sandbox.stub(lib, 'got').resolves(libMockData.exchangeRatesResponse)

          const result = await lib.getCoinbasePrice()
          // console.log(`result: ${JSON.stringify(result, null, 2)}`)

          assert.isNumber(result)
        } catch (error) {
          assert.fail('Unexpected result')
        }
      })

      it('should handle error ', async () => {
        try {
          sandbox
            .stub(lib, 'got')
            .throws(new Error('Coinbase exchange rate could not be retrieved!'))

          await lib.getCoinbasePrice()
          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(
            error.message,
            'Coinbase exchange rate could not be retrieved!'
          )
          // console.log('error: ', error)
        }
      })
    })

    describe('#getCoinexPrice', () => {
      it('should get Coinex Price for BCH', async () => {
        sandbox.stub(lib.bch.bchjs.Price, 'getBchUsd').resolves(558.99)

        const result = await lib.getCoinexPrice()
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.isNumber(result)
      })

      it('should handle error ', async () => {
        try {
          sandbox
            .stub(lib.bch.bchjs.Price, 'getBchUsd')
            .rejects(new Error('test error'))

          const result = await lib.getCoinexPrice()
          console.log('result: ', result)

          assert.fail('Unexpected result')
        } catch (error) {
          // console.log('error: ', error)
          assert.include(error.message, 'test error')
        }
      })
    })

    describe('#getPrice()', () => {
      it('should get the current price from coinbase api', async () => {
        try {
          sandbox.stub(lib, 'getCoinbasePrice').resolves(540.00)

          // sandbox.stub(lib.bch, 'getBCHBalance').resolves(12.44768481)

          const result = await lib.getPrice()
          assert.isNumber(result)
        } catch (error) {
          assert.fail('Unexpected result')
        }
      })

      it('should get price from Coinex if Coinbase fails', async () => {
        // Force an error with Coinbase.
        sandbox.stub(lib, 'getCoinbasePrice').rejects(new Error('test error'))

        // Stub network connection to Coinex.
        sandbox.stub(lib, 'getCoinexPrice').resolves(540.00)

        const result = await lib.getPrice()
        assert.isNumber(result)
      })

      it('should get the current price from the local state if an error is thrown', async () => {
        try {
          // Force an error with Coinbase.
          sandbox.stub(lib, 'getCoinbasePrice').rejects(new Error('test error'))

          // Force an error with Coinex
          sandbox.stub(lib, 'getCoinexPrice').rejects(new Error('test error'))

          const result = await lib.getPrice()
          // console.log('result: ', result)

          assert.isNumber(result)
        } catch (error) {
          console.log('error: ', error)
          assert.fail('Unexpected result')
        }
      })

      it('should get the current price from the local state if a second error is thrown', async () => {
        try {
          // Force an error with Coinbase.
          sandbox.stub(lib, 'getCoinbasePrice').rejects(new Error('test error'))

          // Force an error with Coinex
          sandbox.stub(lib, 'getCoinexPrice').rejects(new Error('test error'))

          // Force an error in working with the blockchain.
          sandbox.stub(lib.bch, 'getBCHBalance').rejects(new Error('test error'))

          const result = await lib.getPrice()
          // console.log('result: ', result)

          assert.isNumber(result)
        } catch (error) {
          console.log('error: ', error)
          assert.fail('Unexpected result')
        }
      })

      // it('should handle error ', async () => {
      //   try {
      //     sandbox
      //       .stub(lib, 'got')
      //       .throws(new Error('Coinbase exchange rate could not be retrieved!'))
      //     sandbox
      //       .stub(lib.tlUtil, 'readState')
      //       .throws(
      //         new Error('Cant get the current price from the local state')
      //       )
      //
      //     await lib.getPrice()
      //     assert.fail('Unexpected result')
      //   } catch (error) {
      //     assert.include(
      //       error.message,
      //       'Cant get the current price from the local state'
      //     )
      //   }
      // })
    })

    describe('#getBlockchainBalances()', () => {
      it('should get the current blockchain balances', async () => {
        try {
          sandbox.stub(lib.bch, 'getBCHBalance').resolves(12.44768481)
          sandbox.stub(lib.slp, 'getTokenBalance').resolves(12.44768481)

          const result = await lib.getBlockchainBalances()
          assert.property(result, 'bchBalance')
          assert.property(result, 'tokenBalance')
          assert.isNumber(result.bchBalance)
          assert.isNumber(result.tokenBalance)
        } catch (error) {
          assert.fail('Unexpected result')
        }
      })

      it('should handle error if an error is thrown getting bch balance', async () => {
        try {
          sandbox.stub(lib.bch, 'getBCHBalance').throws(new Error('test error'))

          await lib.getBlockchainBalances()
          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'test error')
        }
      })

      it('should handle error if an error is thrown getting slp balance', async () => {
        try {
          sandbox.stub(lib.bch, 'getBCHBalance').resolves(12.44768481)
          sandbox
            .stub(lib.slp, 'getTokenBalance')
            .throws(new Error('test error'))

          await lib.getBlockchainBalances()
          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'test error')
        }
      })
    })

    describe('#getSpotPrice()', () => {
      it('should get the spot price', async () => {
        try {
          const bchBalance = 12.44768481
          const usdPerBCH = 1

          const result = await lib.getSpotPrice(bchBalance, usdPerBCH)

          assert.isNumber(result)
        } catch (error) {
          assert.fail('Unexpected result')
        }
      })

      it('should throw error if bchBalance is not provided', async () => {
        try {
          await lib.getSpotPrice()

          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'bchBalance is required')
        }
      })

      it('should throw error if usdPerBCH is not provided', async () => {
        try {
          const bchBalance = 12.44768481

          await lib.getSpotPrice(bchBalance)

          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'usdPerBCH is required')
        }
      })

      it('should handle error', async () => {
        try {
          const bchBalance = 12.44768481
          const usdPerBCH = 1
          sandbox.stub(lib.tlUtil, 'round8').throws(new Error('test error'))

          await lib.getSpotPrice(bchBalance, usdPerBCH)

          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'test error')
        }
      })
    })

    describe('#getEffectiveTokenBalance()', () => {
      it('should get token balance', async () => {
        try {
          const bchBalance = 12.44768481

          const result = await lib.getEffectiveTokenBalance(bchBalance)

          assert.isNumber(result)
        } catch (error) {
          assert.fail('Unexpected result')
        }
      })

      it('should throw error if bchBalance is not provided', async () => {
        try {
          await lib.getEffectiveTokenBalance()

          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'bchBalance is required')
        }
      })

      it('should handle error', async () => {
        try {
          const bchBalance = 12.44768481
          sandbox.stub(lib.tlUtil, 'round8').throws(new Error('test error'))

          await lib.getEffectiveTokenBalance(bchBalance)

          assert.fail('Unexpected result')
        } catch (error) {
          assert.include(error.message, 'test error')
        }
      })
    })
  }
})
