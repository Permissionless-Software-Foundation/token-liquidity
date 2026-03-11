/*
  Unit tests for the index.js file that aggregates all use-cases.
*/

import { assert } from 'chai'
import sinon from 'sinon'
import UseCases from '../../../src/use-cases/index.js'
import adapters from '../mocks/adapters/index.js'

describe('#use-cases', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new UseCases({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new UseCases()

        assert.fail('Unexpected code path')

        // This is here to prevent the linter from complaining.
        assert.isOk(uut)
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Use Cases library.'
        )
      }
    })
  })
})
