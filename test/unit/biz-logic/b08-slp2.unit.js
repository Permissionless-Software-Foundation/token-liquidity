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

    it('should catch, report, and throw errors', async () => {
      // Force error
      sandbox.stub(uut, 'waitForWalletInit').rejects(new Error('test error'))

      try {
        await uut.getTokenBalance()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })
  })

  describe('#txDetails', () => {
    it('should catch, report, and throw errors', async () => {
      // Force error
      sandbox.stub(uut, 'waitForWalletInit').rejects(new Error('test error'))

      try {
        await uut.txDetails()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })

    it('should get tx details for a token tx', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'waitForWalletInit').resolves()
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'tx')
        .resolves({ txData: mockData.tokenTx01 })

      const txid =
        '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d'
      const result = await uut.txDetails(txid)
      // console.log("result: ", result);

      assert.equal(result.txid, txid)
      assert.equal(result.isValidSlp, true)
    })
  })

  describe('#tokenTxInfo', () => {
    it('should return false when there is an error', async () => {
      // Force an error
      sandbox.stub(uut, 'txDetails').rejects(new Error('test error'))

      const result = await uut.tokenTxInfo()

      assert.equal(result, false)
    })

    it('should return quantity of valid token TX', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'txDetails').resolves(mockData.tokenTx01)

      const txid =
        '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d'

      const result = await uut.tokenTxInfo(txid)
      // console.log(retokenTxInfosult);

      assert.equal(result, 10)
    })

    it('should return false for non-token TX', async () => {
      // Force an error
      sandbox.stub(uut, 'txDetails').resolves(mockData.tokenTx02)

      const result = await uut.tokenTxInfo()

      assert.equal(result, false)
    })

    it('should return false for token TX of different token ID', async () => {
      // Force an error
      sandbox.stub(uut, 'txDetails').resolves(mockData.tokenTx02)

      const result = await uut.tokenTxInfo()

      assert.equal(result, false)
    })
  })
})
