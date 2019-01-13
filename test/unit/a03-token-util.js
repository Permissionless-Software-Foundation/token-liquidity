'use strict'

const assert = require('chai').assert
const sinon = require('sinon')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default
const Wormhole = require('wormhole-sdk/lib/Wormhole').default

const lib = require('../../src/utils/token-util')
const bitboxMock = require('./mocks/bitbox')
const { wormholeMock } = require('./mocks/wormhole')
// const testwallet = require('./mocks/testwallet.json')

// Mock out the libraries for sending BCH and tokens
const tknLib = {}
const bchLib = {}
tknLib.sendTokens = sinon.stub().returns({})
bchLib.sendBch = sinon.stub().returns({})

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'

describe('#token-util', () => {
  let BITBOX, wormhole
  // let mockedWallet

  before(() => {})

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    if (process.env.APP_ENV === 'test') {
      BITBOX = bitboxMock.bitboxMock
      wormhole = wormholeMock
    } else {
      BITBOX = new BITBOXSDK({ restURL: 'https://trest.bitcoin.com/v1/' })
      wormhole = new Wormhole({ restURL: `https://trest.bitcoin.com/v1/` })
    }

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
  })

  describe('getBCHBalance', () => {
    it('should get BCH balance', async () => {
      const addr = 'bchtest:qq22ys5qz8z4jzkkex7p5jrdd9vh6q06cgrpsx2fu7'
      const verbose = false

      const bchBalance = await lib.getBCHBalance(addr, verbose, BITBOX)
      // console.log(`bchBalance: ${util.inspect(bchBalance)}`)

      assert.hasAllKeys(bchBalance, [
        'balance',
        'balanceSat',
        'totalReceived',
        'totalReceivedSat',
        'totalSent',
        'totalSentSat',
        'unconfirmedBalance',
        'unconfirmedBalanceSat',
        'unconfirmedTxApperances',
        'txApperances',
        'transactions',
        'legacyAddress',
        'cashAddress'
      ])
      assert.isArray(bchBalance.transactions)
    })
  })

  describe('getTokenBalance', () => {
    it('should get token balance', async () => {
      const addr = 'bchtest:qq22ys5qz8z4jzkkex7p5jrdd9vh6q06cgrpsx2fu7'

      const tokenBalance = await lib.getTokenBalance(addr, wormhole)
      // console.log(`bchBalance: ${util.inspect(tokenBalance)}`)

      assert.isArray(tokenBalance)
      assert.hasAllKeys(tokenBalance[0], ['propertyid', 'balance', 'reserved'])
    })
  })

  describe('recievedBch', () => {
    it('should return 0 if address is not in TX', async () => {
      const txid = 'a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9'
      const addr = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pabc`

      const value = await lib.testableComponents.recievedBch(txid, addr, BITBOX)

      assert.isNumber(value)
      assert.equal(value, 0, 'Expect 0')
    })

    it('should calculate amount of BCH recieved from a TX', async () => {
      const txid = 'a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9'
      const addr = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`

      const value = await lib.testableComponents.recievedBch(txid, addr, BITBOX)
      // console.log(`value: ${util.inspect(value)}`)

      assert.isNumber(value)
      assert.equal(value, 0.0001)
    })
  })

  describe('round8()', () => {
    it('should round to 8 decimal places', () => {
      const numIn = 1.2345678912345

      const numOut = lib.testableComponents.round8(numIn)
      // console.log(`numOut: ${numOut}`)

      assert.equal(numOut, 1.23456789)
    })
  })

  describe('tokenTxInfo()', () => {
    if (process.env.APP_ENV !== 'test') {
      it('should return false for a non-token TX', async () => {
        const txid = 'a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9'

        const result = await lib.testableComponents.tokenTxInfo(txid, wormhole)
        // console.log(`result: ${util.inspect(result)}`)

        assert.equal(result, false, 'Expecting false')
      })
    }

    it('should return info on a token TX', async () => {
      const txid = '3b2e9747767cf3d0070ceaffbd60ae40f1cd46f04c8dac3617659073f324f19d'

      const result = await lib.testableComponents.tokenTxInfo(txid, wormhole)
      // console.log(`result: ${util.inspect(result)}`)

      assert.isNumber(result)
      assert.equal(result, 4567)
    })
  })

  describe('exchangeTokensForBCH', () => {
    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        tokenIn: 500,
        tokenBalance: 8500,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const result = lib.exchangeTokensForBCH(exchangeObj)
      // console.log(`result: ${result}`)

      assert.isNumber(result)
      assert.equal(result, 1.1814112, `Should match spreadsheet`)
    })
  })

  describe('exchangeBCHForTokens', () => {
    it('should calculate values in the spreadsheet', () => {
      const exchangeObj = {
        bchIn: 1.181410849,
        bchBalance: 12.41463259,
        bchOriginalBalance: 25,
        tokenOriginalBalance: 5000
      }

      const result = lib.exchangeBCHForTokens(exchangeObj)
      // console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ['tokensOut', 'bch2', 'token2'])
      assert.equal(Math.floor(result.tokensOut), 500, `Should match spreadsheet`)
      assert.isNumber(result.bch2)
      assert.isNumber(result.token2)
    })
  })

  describe('getUserAddr', () => {
    it('should should throw an error for an invalid transaction', async () => {
      try {
        const txid = `cf1b5d374e171876a625599a489a2a6cdda119fb84b6cff2a226c39e189`

        await lib.testableComponents.getUserAddr(txid, BITBOX)

        assert(true, false, 'Unexpected result')
      } catch (err) {
        // console.log(`err: `, err)
        assert.include(err, '502: Bad gateway')
      }
    })

    it('should return senders cash address', async () => {
      const txid = `0d457cf1b5d374e171876a625599a489a2a6cdda119fb84b6cff2a226c39e189`

      const senderAddr = await lib.testableComponents.getUserAddr(txid, BITBOX)
      // console.log(`senderAddr: ${util.inspect(senderAddr)}`)

      assert.isString(senderAddr)
      assert.equal(senderAddr, 'bchtest:qqafk2cvztl8yt70v5akaawucwrn94hl2yups7rzfn')
    })
  })

  describe(`getLastConfirmedTransaction()`, () => {
    it(`should get the last confirmed transaction`, async () => {
      const addr = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`

      const result = await lib.getLastConfirmedTransaction(addr, BITBOX)
      // console.log(`result: ${util.inspect(result)}`)

      assert.isString(result)
    })
  })

  describe(`findBiggestUtxo()`, () => {
    it(`should return the bigger utxo`, () => {
      const utxo1 = { satoshis: 10 }
      const utxo2 = { satoshis: 20 }
      const utxos = [utxo1, utxo2]

      const result = lib.findBiggestUtxo(utxos)
      // console.log(`result: ${util.inspect(result)}`)

      assert.equal(result.satoshis, 20, `bigger utxo value expected`)
    })
  })

  describe(`only2Conf()`, () => {
    it(`should return true if confirmations are greater than 1`, async () => {
      const addr = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`

      const result = await lib.testableComponents.only2Conf(addr, BITBOX)
      // console.log(`result: ${util.inspect(result)}`)

      assert.equal(result, true)
    })

    if (process.env.APP_ENV === 'test') {
      it(`should return false if confirmations are less than 2`, async () => {
        bitboxMock.mockTransactions.txs[0].confirmations = 0
        const addr = `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`
        // console.log(`blah: ${util.inspect(blah.txs[0].confirmations)}`)

        const result = await lib.testableComponents.only2Conf(addr, BITBOX)
        // console.log(`result: ${util.inspect(result)}`)

        bitboxMock.mockTransactions.txs[0].confirmations = 30

        assert.equal(result, false)
      })
    }
  })

  // Only run these tests for a unit test.
  if (process.env.APP_ENV === 'test') {
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

      it('should send BCH in exchange for tokens', async () => {
        const obj = {
          bchAddr: `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`,
          txid: `298e9186a2113443f3b2064ee0bf0ae1973434ae48e9ec3c3e27bfea41d41b05`,
          bchBalance: 7.68905269,
          tokenBalance: 100000
        }

        const result = await lib.compareLastTransaction(obj, tknLib, bchLib, BITBOX)
        // console.log(`result: ${util.inspect(result)}`)

        // Should return the last transactions, as well as the new balance of BCH
        // and the token.
        assert.hasAllKeys(result, ['lastTransaction', 'bchBalance', 'tokenBalance'])
      })

      it('should send tokens in exchange for BCH', async () => {
        const obj = {
          bchAddr: `bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`,
          txid: `a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9`,
          bchBalance: 7.68905269,
          tokenBalance: 100000
        }
        //

        // Force tokenTxInfo to return false
        wormhole.DataRetrieval.transaction = sinon.stub().throws(new Error('some error'))

        const result = await lib.compareLastTransaction(obj, tknLib, bchLib, wormhole)
        // console.log(`result: ${util.inspect(result)}`)

        // Should return the last transactions, as well as the new balance of BCH
        // and the token.
        assert.hasAllKeys(result, ['lastTransaction', 'bchBalance', 'tokenBalance'])
      })
    })
  }
})
