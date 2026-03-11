/*
  This is a top-level library that encapsulates all the additional Use Cases.
  The concept of Use Cases comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Local libraries
import { UserLib } from './user.js'
import { TLMain } from './tl-main.js'
import config from '../../config/index.js'

export class UseCases {
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
    this.user = new UserLib(localConfig)
    this.tlMain = new TLMain(localConfig)
  }

  async startUseCases () {
    try {
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

export default UseCases
