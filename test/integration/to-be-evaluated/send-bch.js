/*
  An integration test for the sendBch() method in the bch.js library.
*/

'use strict'

const assert = require('chai').assert

// Determine if this is a Unit or Integration test
// If not specified, default to unit test.
if (!process.env.APP_ENV) process.env.APP_ENV = 'test'
if (!process.env.TEST_ENV) process.env.TEST_ENV = 'integration'

const config = require('../../config')

const BCH = require('../../src/lib/bch')
const bch = new BCH()

// Used for debugging.
const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

describe('#bch', () => {
  describe('#send-bch', () => {
    it('should send bch', async () => {
      const obj = {
        recvAddr: config.BCH_ADDR,
        satoshisToSend: 1000
      }

      const hex = await bch.createBchTx(obj)
      // console.log(hex)

      assert.isString(hex)
    })
  })
})
