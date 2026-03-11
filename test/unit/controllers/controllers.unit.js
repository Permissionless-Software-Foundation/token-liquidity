/*
  Unit tests for controllers index.js file.
*/

import sinon from 'sinon'
import Controllers from '../../../src/controllers/index.js'

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
