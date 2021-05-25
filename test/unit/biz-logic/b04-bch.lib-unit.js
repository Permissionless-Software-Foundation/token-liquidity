/*
  Unit and integration tests for bch.js library.
*/

'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')

const BCH = require('../../../src/lib/bch')

const bchMockDataLib = require('../mocks/bch.mock')
const mockWallet = require('../mocks/testwallet.json')

const config = require('../../../config')

// If not specified, default to unit test.
if (!process.env.TL_ENV) process.env.TL_ENV = 'test'

describe('#bch-lib', () => {
  let sandbox
  let uut
  let bchMockData
  let tempConfig

  before(() => {})

  beforeEach(() => {
    uut = new BCH(config)

    bchMockData = cloneDeep(bchMockDataLib)
    tempConfig = cloneDeep(config)

    // mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#getBCHBalance', () => {
    it('should get BCH balance', async () => {
      sandbox
        .stub(uut.bchjs.Electrumx, 'balance')
        .resolves(bchMockData.fulcrumBalance)

      const addr = 'bchtest:qq22ys5qz8z4jzkkex7p5jrdd9vh6q06cgrpsx2fu7'
      const verbose = true

      const bchBalance = await uut.getBCHBalance(addr, verbose)
      // console.log(`bchBalance: ${util.inspect(bchBalance)}`)

      // assert.hasAnyKeys(bchBalance, ['balance', 'txids'])
      // assert.isArray(bchBalance.txids)
      assert.isNumber(bchBalance)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Electrumx, 'balance')
          .rejects(new Error('test error'))

        const addr = 'bchtest:qq22ys5qz8z4jzkkex7p5jrdd9vh6q06cgrpsx2fu7'

        await uut.getBCHBalance(addr)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('findBiggestUtxo()', () => {
    it('should throw an error if utxos is not an array', async () => {
      try {
        const utxos = { value: 10 }
        await uut.findBiggestUtxo(utxos)
      } catch (err) {
        assert.include(
          err.message,
          'utxos needs to be an array',
          'Expected error message.'
        )
      }
    })

    it('should return the bigger utxo', async () => {
      const utxos = [
        {
          txid:
            'fe3c23dfefe37efc4227c93d9b4f6eadc94dce3844156b9651a46e9b740d27dd',
          tx_hash:
            'fe3c23dfefe37efc4227c93d9b4f6eadc94dce3844156b9651a46e9b740d27dd',
          vout: 1,
          tx_pos: 1,
          amount: 0.00000546,
          satoshis: 546,
          value: 546,
          height: 1348643,
          confirmations: 5
        },
        {
          txid:
            '03fa935916161425d4db11c3f4cc7fc6b9cbea01ded88fe4818c41ccf5431e5c',
          tx_hash:
            '03fa935916161425d4db11c3f4cc7fc6b9cbea01ded88fe4818c41ccf5431e5c',
          vout: 1,
          tx_pos: 1,
          amount: 12.04311016,
          satoshis: 1000,
          value: 1000,
          height: 1348645,
          confirmations: 3
        }
      ]

      // Stub the getTxOut network call.
      sandbox
        .stub(uut.bchjs.Blockchain, 'getTxOut')
        .resolves(bchMockData.getTxOutValid)

      const result = await uut.findBiggestUtxo(utxos)
      // console.log(`blah result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.satoshis, 1000, 'bigger utxo value expected')
    })

    it('should ignore a UTXO if invalid', async () => {
      const utxos = [
        {
          txid:
            'fe3c23dfefe37efc4227c93d9b4f6eadc94dce3844156b9651a46e9b740d27dd',
          tx_hash:
            'fe3c23dfefe37efc4227c93d9b4f6eadc94dce3844156b9651a46e9b740d27dd',
          vout: 1,
          tx_pos: 1,
          amount: 0.00000546,
          satoshis: 546,
          value: 546,
          height: 1348643,
          confirmations: 5
        },
        {
          txid:
            '03fa935916161425d4db11c3f4cc7fc6b9cbea01ded88fe4818c41ccf5431e5c',
          tx_hash:
            '03fa935916161425d4db11c3f4cc7fc6b9cbea01ded88fe4818c41ccf5431e5c',
          vout: 1,
          tx_pos: 1,
          amount: 12.04311016,
          satoshis: 1000,
          value: 1000,
          height: 1348645,
          confirmations: 3
        }
      ]

      // Stub the getTxOut network call.
      sandbox.stub(uut.bchjs.Blockchain, 'getTxOut').resolves(null)

      const result = await uut.findBiggestUtxo(utxos)
      // console.log(`blah result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.satoshis, 546, 'lower utxo value expected')
    })
  })

  describe('recievedBch', () => {
    it('should return 0 if address is not in TX', async () => {
      // If unit test, use the mocking library instead of live calls.
      if (process.env.TEST_ENV === 'unit') {
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(bchMockData.txDetails)
      }

      const txid =
        'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'
      const addr = 'bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pabc'

      const value = await uut.recievedBch(txid, addr)

      assert.isNumber(value)
      assert.equal(value, 0, 'Expect 0')
    })

    it('should calculate amount of BCH recieved from a TX', async () => {
      // If unit test, use the mocking library instead of live calls.

      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.txDetails)

      const txid =
        'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'
      const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      const value = await uut.recievedBch(txid, addr)
      // console.log(`value: ${util.inspect(value)}`)

      assert.isNumber(value)
      assert.equal(value, 0.0001)
    })

    it('should return 0 if value is zero', async () => {
      // Manipulate mocking data to force the output for the test.
      bchMockData.txDetails.vout[0].value = 0

      // If unit test, use the mocking library instead of live calls.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.txDetails)

      const txid =
        'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'
      const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      const value = await uut.recievedBch(txid, addr)
      // console.log(`value: ${JSON.stringify(value, null, 2)}`)

      assert.isNumber(value)
      assert.equal(value, 0)
    })

    it('should return 0 if address is empty', async () => {
      // Manipulate mocking data to force the output for the test.
      bchMockData.txDetails.vout[0].scriptPubKey.addresses = []

      // If unit test, use the mocking library instead of live calls.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.txDetails)

      const txid =
        'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'
      const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      const value = await uut.recievedBch(txid, addr)
      console.log(`value: ${JSON.stringify(value, null, 2)}`)

      assert.isNumber(value)
      assert.equal(value, 0)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .rejects(new Error('test error'))

        const txid =
          'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'
        const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

        await uut.recievedBch(txid, addr)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#createBchTx', () => {
    it('should send BCH on testnet', async () => {
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

      sandbox.stub(uut, 'getBCHBalance').resolves(100095602)

      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(bchMockData.fulcrumUtxos)

      sandbox.stub(uut, 'findBiggestUtxo').resolves(bchMockData.utxos[1])

      const obj = {
        recvAddr: tempConfig.BCH_ADDR,
        satoshisToSend: 1000
      }

      const hex = await uut.createBchTx(obj)
      // console.log(hex)

      assert.isString(hex)
    })

    it('should stop app if balance is zero', async () => {
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

      sandbox.stub(uut, 'getBCHBalance').resolves(0)

      const obj = {
        recvAddr: tempConfig.BCH_ADDR,
        satoshisToSend: 1000
      }

      const hex = await uut.createBchTx(obj)

      assert.equal(hex, 0)
    })

    it('should send BCH on mainnet', async () => {
      tempConfig.NETWORK = 'mainnet'
      tempConfig.SLP_ADDR =
        'simpleledger:qq0qr5aqv6whvjrhfygk7s38qmuglf5sm5ufqqaqm5'
      tempConfig.BCH_ADDR =
        'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      uut = new BCH(tempConfig)

      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

      sandbox.stub(uut, 'getBCHBalance').resolves(100095602)

      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(bchMockData.fulcrumUtxos)

      sandbox.stub(uut, 'findBiggestUtxo').resolves(bchMockData.utxos[1])

      const obj = {
        recvAddr: tempConfig.BCH_ADDR,
        satoshisToSend: 1000
      }

      const hex = await uut.createBchTx(obj)
      // console.log(hex)

      assert.isString(hex)
    })

    it('should throw an error if remainder has less than dust', async () => {
      try {
        // Modify the mock data to force the error for this test.
        bchMockData.utxos[1].value = 1500

        sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

        sandbox.stub(uut, 'getBCHBalance').resolves(100095602)

        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .resolves(bchMockData.fulcrumUtxos)

        sandbox.stub(uut, 'findBiggestUtxo').resolves(bchMockData.utxos[1])

        const obj = {
          recvAddr: tempConfig.BCH_ADDR,
          satoshisToSend: 1000
        }

        await uut.createBchTx(obj)
        // console.log(hex)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'UTXO selected is too small. Remainder')
      }
    })
  })

  describe('#broadcastBchTx', () => {
    it('should broadcast a tx and return the txid', async () => {
      // Mock out dependency.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        .resolves('txid')

      const hex = '0200...'

      const result = await uut.broadcastBchTx(hex)

      assert.equal(result, 'txid')
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .rejects(new Error('test error'))

        const hex = '0200...'

        await uut.broadcastBchTx(hex)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('should catch and throw errors from the full node', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .rejects({ error: 'test error' })

        const hex = '0200...'

        await uut.broadcastBchTx(hex)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#changeAddrFromMnemonic', () => {
    it('should return a change address', async () => {
      const mnemonic =
        'space waste topic swing park enrich disease release razor solution wait school'

      const result = await uut.changeAddrFromMnemonic(mnemonic)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.hasAllKeys(result, [
        'keyPair',
        'chainCode',
        'depth',
        'index',
        'parentFingerprint'
      ])
    })
  })

  describe('#readOpReturn', () => {
    it('should return isValid=false for invalid txid', async () => {
      // Mock network calls.
      sandbox.stub(uut.bchjs.RawTransactions, 'getRawTransaction').throws({
        error:
          'No such mempool or blockchain transaction. Use gettransaction for wallet transactions.'
      })

      const txid =
        '4894f89965809733f728e3b3f22d0015c0bf87b6a809db00a82f2841303d9555'

      const opReturnData = await uut.readOpReturn(txid)
      // console.log(`opReturnData: ${JSON.stringify(opReturnData, null, 2)}`)

      assert.equal(opReturnData.isValid, false)
    })

    it('should return isValid=false for SLP tx', async () => {
      // Mock network calls.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.slpOpReturnTx)

      const txid =
        '4894f89965809733f728e3b3f22d0015c0bf87b6a809db00a82f2841303d9de3'

      const opReturnData = await uut.readOpReturn(txid)
      // console.log(`opReturnData: ${JSON.stringify(opReturnData, null, 2)}`)

      assert.equal(opReturnData.isValid, false)
    })

    it('should processes a valid BURN command', async () => {
      // Mock network calls.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.burnOpReturnTx)

      const txid =
        '73e0b24ab94413c8bf003168c533653b91c9409218cf4ed601b77734856770d1'

      const opReturnData = await uut.readOpReturn(txid)
      // console.log(`opReturnData: ${JSON.stringify(opReturnData, null, 2)}`)

      assert.equal(opReturnData.isValid, true)
      assert.equal(opReturnData.type, 'burn')
      // assert.equal(opReturnData.qty, 10)
    })

    it('should return isValid=false for tx without OP_RETURN', async () => {
      // Mock network calls.
      sandbox
        .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
        .resolves(bchMockData.noOpReturnTx)

      const txid =
        '07200217e2fd235b96030e3b775678871184084bb27d5d9c15957722c29c8709'

      const opReturnData = await uut.readOpReturn(txid)
      // console.log(`opReturnData: ${JSON.stringify(opReturnData, null, 2)}`)

      assert.equal(opReturnData.isValid, false)
    })
  })

  describe('#sortTxsByHeight', () => {
    it('should sort the transactions', async () => {
      try {
        const transactions = bchMockData.transactions
        const result = await uut.sortTxsByHeight(transactions)
        assert.isArray(result)
        assert.equal(result.length, transactions.length)
      } catch (err) {
        // console.log(err)
        assert.equal(true, false, 'Unexpected result!')
      }
    })

    it('should sort the transactions in descending order', async () => {
      try {
        const transactions = bchMockData.transactions
        const result = await uut.sortTxsByHeight(transactions, 'DESCENDING')
        assert.isArray(result)
        assert.equal(result.length, transactions.length)
      } catch (err) {
        // console.log(err)
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })

  describe('#getTransactions', () => {
    it('should get transaction details for an address', async () => {
      // Mock live network calls.
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves(bchMockData.mockTxHistory)

      const bchAddr = 'bitcoincash:qqacnkvctp4pg8f60gklz6gpx4xwx3587sh60ejs2j'
      const result = await uut.getTransactions(bchAddr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.property(result[0], 'tx_hash')
      assert.property(result[0], 'height')
    })

    it('should handle and throw errors', async () => {
      try {
        // Force an error
        bchMockData.mockTxHistory.success = false
        sandbox
          .stub(uut.bchjs.Electrumx, 'transactions')
          .resolves(bchMockData.mockTxHistory)

        const bchAddr = 'bitcoincash:qqacnkvctp4pg8f60gklz6gpx4xwx3587sh60ejs2j'
        await uut.getTransactions(bchAddr)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'No transaction history could be found')
      }
    })
  })

  describe('#consolidateUtxos', () => {
    it('should throw return false when there is not enough UTXOs to consolidate.', async () => {
      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(bchMockData.fulcrumUtxos)

      const result = await uut.consolidateUtxos()

      assert.equal(result, false)
    })

    it('should return hex string for consolidating on testnet', async () => {
      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(bchMockData.fulcrum11Utxos)

      const result = await uut.consolidateUtxos()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
    })

    it('should return hex string for consolidating on mainnet', async () => {
      tempConfig.NETWORK = 'mainnet'
      tempConfig.SLP_ADDR =
        'simpleledger:qq0qr5aqv6whvjrhfygk7s38qmuglf5sm5ufqqaqm5'
      tempConfig.BCH_ADDR =
        'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'

      uut = new BCH(tempConfig)

      sandbox.stub(uut.tlUtils, 'openWallet').returns(mockWallet)

      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves(bchMockData.fulcrum11Utxos)

      const result = await uut.consolidateUtxos()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .rejects(new Error('test error'))

        await uut.consolidateUtxos()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#addFee', () => {
    it('should reduce the input by 1%', () => {
      const startAmount = 0.001

      const result = uut.addFee(startAmount)
      console.log(`result: ${result}`)

      assert.equal(result, 0.00099)
    })

    it('should catch and throw an error', () => {
      try {
        // force an error.
        sandbox.stub(uut.bchjs.Util, 'floor8').throws(new Error('test error'))

        uut.addFee(0.001)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })
  })
})
