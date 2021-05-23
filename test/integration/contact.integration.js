/*
  Integration test for the email contact library
*/

const assert = require('chai').assert

const ContactLib = require('../../src/lib/contact')
let uut

describe('#contact', () => {
  beforeEach(() => {
    uut = new ContactLib()
  })

  describe('#sendTLEmailAlert', () => {
    it('should send an email alert', async () => {
      // Force config setting.
      uut.config.useEmailAlerts = 1

      const emailObj = {
        callerMsg: 'lib/slp.js/handleMoveTokenError()',
        errorObj: new Error('test error message')
      }

      const result = await uut.sendTLEmailAlert(emailObj)
      console.log('result: ', result)

      assert.property(result, 'accepted')
      assert.property(result, 'rejected')
      assert.property(result, 'envelope')
    })
  })
})
