/*
  Unit tests for the REST API handler for the /users endpoints.
*/

import { assert } from 'chai'
import sinon from 'sinon'
import UserRouter from '../../../../../src/controllers/rest-api/users/index.js'
import adapters from '../../../mocks/adapters/index.js'
const useCases = {}

let uut
let sandbox
// let ctx

// const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Users-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    uut = new UserRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new UserRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating PostEntry REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        const adapters = class {}
        uut = new UserRouter({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating PostEntry REST Controller.'
        )
      }
    })
  })

  describe('#attach', () => {
    it('should throw an error if app is not passed in.', () => {
      try {
        uut.attach()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Must pass app object when attaching REST API controllers.'
        )
      }
    })
  })
})
