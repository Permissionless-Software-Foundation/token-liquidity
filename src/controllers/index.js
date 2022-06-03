/*
  This is a top-level library that encapsulates all the additional Controllers.
  The concept of Controllers comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Public npm libraries.

// Load the Clean Architecture Adapters library
const Adapters = require('../adapters')

// Load the Clean Architecture Use Case libraries.
const UseCases = require('../use-cases')

// Load the REST API Controllers.
const RESTControllers = require('./rest-api')

class Controllers {
  constructor (localConfig = {}) {
    this.adapters = new Adapters()
    this.useCases = new UseCases({ adapters: this.adapters })
  }

  // Spin up any adapter libraries that have async startup needs.
  async initAdapters () {
    await this.adapters.startAdapters()
  }

  // Top-level function for this library.
  // Start the various Controllers and attach them to the app.
  attachRESTControllers (app) {
    const restControllers = new RESTControllers({
      adapters: this.adapters,
      useCases: this.useCases
    })

    // Attach the REST API Controllers associated with the boilerplate code to the Koa app.
    restControllers.attachRESTControllers(app)
  }
}

module.exports = Controllers
