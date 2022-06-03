/*
  Unit tests for controllers index.js file.
*/

// Public npm libraries
// const assert = require('chai').assert
const sinon = require('sinon')

const Controllers = require('../../../src/controllers')

describe('#Controllers', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new Controllers()
  })

  afterEach(() => sandbox.restore())

  describe('#attachRESTControllers', () => {
    it('should attach the controllers', async () => {
      const app = {
        use: () => {}
      }

      await uut.attachRESTControllers(app)
    })
  })
})
