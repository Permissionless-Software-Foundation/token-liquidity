/*
  Unit tests for the slp2.js library.
*/

// Public npm libraries.
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries.
const config = require('../../../config')
const SLP2 = require('../../../src/lib/slp2')
const mockDataLib = require('../mocks/slp2.mock')

describe('#slp2.js', () => {
  let uut, sandbox, mockData

  beforeEach(() => {
    uut = new SLP2(config)

    sandbox = sinon.createSandbox()

    mockData = mockDataLib
  })

  describe('#getTokenBalance', () => {
    it('should return the balance of tokens', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'waitForWalletInit').resolves()
      sandbox
        .stub(uut.bchWallet, 'listTokens')
        .resolves(mockData.tokenBalance01)

      const result = await uut.getTokenBalance()
      // console.log("result: ", result);

      assert.equal(result, mockData.tokenBalance01[0].qty)
    })
  })
})
