/*
  Unit tests for the REST API controllers/rest-api/index.js library.
*/

import { assert } from 'chai'
import sinon from 'sinon'
import RESTControllers from '../../../../src/controllers/rest-api/index.js'

const useCases = {}
const adapters = {}
describe('#RESTControllers', () => {
  let uut
  let sandbox
  // let ctx

  before(async () => {})

  beforeEach(() => {
    uut = new RESTControllers({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new RESTControllers()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating REST Controller libraries.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new RESTControllers({ adapters })

        assert.fail('Unexpected code path')

        // use to prevent complaints from linter.
        console.log('uut: ', uut)
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating REST Controller libraries.'
        )
      }
    })
  })
})
