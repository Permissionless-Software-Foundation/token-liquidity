/*
  Unit tests for the REST API handler for the /users endpoints.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
// const adapters = require('../../../mocks/adapters')
// const UseCasesMock = require('../../../mocks/use-cases')
// const app = require('../../../mocks/app-mock')

const AuthRESTController = require('../../../../../src/controllers/rest-api/auth/controller')
let uut
let sandbox
let ctx

const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Auth-REST-Router', () => {
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
