/*
  This is a top-level library that encapsulates all the additional Use Cases.
  The concept of Use Cases comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Local libraries
const UserUseCases = require('./user')
const TLMain = require('./tl-main')
const config = require('../../config')

class UseCases {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Use Cases library.'
      )
    }

    // Encapsulate dependencies
    this.config = config
    this.user = new UserUseCases(localConfig)
    this.tlMain = new TLMain(localConfig)
  }

  // Run any startup Use Cases at the start of the app.
  async startUseCases () {
    try {
      // Skip this section when running automated e2e tests.
      if (this.config.env !== 'test') {
        await this.tlMain.initState()
      }
    } catch (err) {
      console.error('Error in use-cases/index.js/startUseCases()')
      console.log(err)
      throw err
    }
  }
}

module.exports = UseCases
