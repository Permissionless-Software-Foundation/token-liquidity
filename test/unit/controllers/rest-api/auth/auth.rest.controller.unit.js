/*
  Unit tests for the REST API handler for the /users endpoints.
*/

import { assert } from 'chai'
import sinon from 'sinon'
import AuthRESTController from '../../../../../src/controllers/rest-api/auth/controller.js'
import { context as mockContext } from '../../../../unit/mocks/ctx-mock.js'

describe('#Auth-REST-Router', () => {
  let uut, sandbox, ctx
  // const testUser = {}

  beforeEach(() => {
    uut = new AuthRESTController()

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#authUser', () => {
    it('should authorize a user', async () => {
      // Mock dependencies
      const user = {
        toJSON: () => {
          return { password: 'password' }
        },
        generateToken: () => {}
      }
      sandbox.stub(uut.passport, 'authUser').resolves(user)

      await uut.authUser(ctx)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.passport, 'authUser').rejects('test error')

        await uut.authUser(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'Unauthorized')
      }
    })
  })
})
