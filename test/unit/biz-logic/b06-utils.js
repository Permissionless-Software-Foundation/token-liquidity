/*
  Unit tests for the util.js library.
*/

'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const nock = require('nock')

const TLUtils = require('../../../src/lib/util')

// const bitboxMock = require('bitbox-mock')
// const txMockData = require('./mocks/transactions')
const mockWallet = require('../mocks/testwallet.json')

// const config = require('../../config')

// Used for debugging.
const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'
if (!process.env.TEST_ENV) process.env.TEST_ENV = 'unit'
// const REST_URL = `https://trest.bitcoin.com/v2/`

describe('#utils', () => {
  let sandbox
  let tlUtils

  before(() => {})

  beforeEach(() => {
    tlUtils = new TLUtils()

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

  describe('#round8', () => {
    it('should round to 8 decimal places', () => {
      const numIn = 1.2345678912345

      const numOut = tlUtils.round8(numIn)
      // console.log(`numOut: ${numOut}`)

      assert.equal(numOut, 1.23456789)
    })
  })

  describe('#openWallet', () => {
    it('should open wallet file or report that wallet file does not exist', async () => {
      sandbox.stub(tlUtils, 'openWallet').returns(mockWallet)
      const walletInfo = tlUtils.openWallet()
      // console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

      if (walletInfo.error) {
        assert.include(
          walletInfo.error,
          'wallet file not found',
          'Wallet file not found'
        )
      } else {
        // console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

        assert.include(walletInfo.rootAddress, 'bchtest:')
      }
    })
  })
})
