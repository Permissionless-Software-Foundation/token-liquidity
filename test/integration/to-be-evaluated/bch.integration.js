/*
  Integration tests for the bch.js library.
*/

const assert = require('chai').assert

process.env.NETWORK = 'mainnet'

const config = require('../../config')

const BCH = require('../../src/lib/bch')
const bch = new BCH(config)

describe('#bch.js', () => {
  describe('#getTransactions', () => {
    it('Should return an array of tx data', async () => {
      const bchAddr = 'bitcoincash:qqlktyx5djtd25nkqxmtm229ks4n0eaknsqtq36tgz'
      const result = await bch.getTransactions(bchAddr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.property(result[0], 'tx_hash')
      assert.property(result[0], 'height')
    })
  })

  describe('#recievedBch', () => {
    it('should display the amount of sats received', async () => {
      const addr = 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm'
      const txid = 'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958'

      const result = await bch.recievedBch(txid, addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })
  })

  describe('#createBchTx', () => {
    it('should generate tx hex', async () => {
      const obj = {
        recvAddr: 'bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm',
        satoshisToSend: 1000
      }

      const result = await bch.createBchTx(obj)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
    })
  })

  describe('#consolidateUtxos', () => {
    it('should generate a tx hex', async () => {
      const result = await bch.consolidateUtxos()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result, undefined)
    })
  })

  describe('#readOpReturn', () => {
    it('should return isValid=false for non-OP_RETURN tx', async () => {
      const txid = '07200217e2fd235b96030e3b775678871184084bb27d5d9c15957722c29c8709'

      const result = await bch.readOpReturn(txid)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.isValid, false)
    })
  })
})
