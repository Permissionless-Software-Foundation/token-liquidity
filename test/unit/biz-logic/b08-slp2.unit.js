/*
  Unit tests for the slp2.js library.
*/

// Public npm libraries.
const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')

// Local libraries.
const config = require('../../../config')
const SLP2 = require('../../../src/lib/slp2')
const mockDataLib = require('../mocks/slp2.mock')
const mockWallet = require('../mocks/testwallet.json')

describe('#slp2.js', () => {
  let uut, sandbox, mockData

  beforeEach(() => {
    uut = new SLP2(config)

    sandbox = sinon.createSandbox()

    mockData = cloneDeep(mockDataLib)
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

  describe('#createTokenTx', () => {
    it('should throw an error if there are no BCH UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(mockData.fulcrumEmtpyUtxos)

        const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(
          err.message,
          'Wallet does not have a BCH UTXO to pay miner fees'
        )
      }
    })

    it('should throw an error if there are no token UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(mockData.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.Utxo, 'findBiggestUtxo')
          .resolves(mockData.bchUtxos01[0])
        sandbox
          .stub(uut.bchjs.PsfSlpIndexer, 'balance')
          .resolves({ balance: { utxos: [] } })

        const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'No token UTXOs to spend! Exiting.')
      }
    })

    it('should throw an error if there are no valid token UTXOs', async () => {
      try {
        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(mockData.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.Utxo, 'findBiggestUtxo')
          .resolves(mockData.bchUtxos01[0])
        mockData.tokenUtxos01[0].tokenId = 'someothertokenid'
        sandbox
          .stub(uut.bchjs.PsfSlpIndexer, 'balance')
          .resolves({ balance: { utxos: mockData.tokenUtxos01 } })

        const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'No token UTXOs are available')
      }
    })

    it('should throw an error if path is zero', async () => {
      try {
        const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
        const qty = 1

        await uut.createTokenTx(addr, qty, 0)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'path must have a value of 145 or 245')
      }
    })

    it('should throw an error if qty is 0', async () => {
      try {
        const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'

        await uut.createTokenTx(addr, 0, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(`err.message: ${err.message}`)
        assert.include(err.message, 'qty must be a positive number.')
      }
    })

    it('should generate a transaction hex for mainnet', async () => {
      // Mock out down-stream dependencies for a unit test.
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
      sandbox.stub(uut.bchjs.Electrumx, 'utxo').resolves(mockData.fulcrumUtxos)
      sandbox
        .stub(uut.bchjs.Utxo, 'findBiggestUtxo')
        .resolves(mockData.bchUtxos01[0])
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'balance')
        .resolves({ balance: { utxos: mockData.tokenUtxos01 } })

      const addr = 'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
      const qty = 1

      const result = await uut.createTokenTx(addr, qty, 245)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
      assert.equal(result.indexOf('0200'), 0, 'First part of string matches.')
    })

    it('should throw an error if remainder has less than dust', async () => {
      try {
        // Modify the mock data to force the error for this test.
        mockData.bchUtxos01[0].value = '1500'

        // Mock out down-stream dependencies for a unit test.
        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(mockData.fulcrumUtxos)
        sandbox
          .stub(uut.bchjs.Utxo, 'findBiggestUtxo')
          .resolves(mockData.bchUtxos01[0])
        sandbox
          .stub(uut.bchjs.PsfSlpIndexer, 'balance')
          .resolves({ balance: { utxos: mockData.tokenUtxos01 } })

        const addr = 'bchtest:qpwa35xq0q0cnmdu0rwzkct369hddzsqpsme94qqh2'
        const qty = 1

        await uut.createTokenTx(addr, qty, 245)
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'Selected UTXO does not have enough satoshis'
        )
      }
    })
  })
})
