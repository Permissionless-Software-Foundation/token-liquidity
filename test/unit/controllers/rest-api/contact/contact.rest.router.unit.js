/*
  Unit tests for the REST API handler for the /users endpoints.
*/

import { assert } from 'chai'
import sinon from 'sinon'
import ContactRouter from '../../../../../src/controllers/rest-api/contact/index.js'
let uut
let sandbox
const useCases = {}
const adapters = {}
// let ctx

// const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Contact-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    uut = new ContactRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new ContactRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating Contact REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new ContactRouter(({ adapters }))

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating Contact REST Controller.'
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
