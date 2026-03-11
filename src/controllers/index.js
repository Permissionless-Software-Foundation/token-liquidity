/*
  This is a top-level library that encapsulates all the additional Controllers.
  The concept of Controllers comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Load the Clean Architecture Adapters library
import Adapters from '../adapters/index.js'
// Load the Clean Architecture Use Case libraries.
import UseCases from '../use-cases/index.js'
// Load the REST API Controllers.
import RESTControllers from './rest-api/index.js'
import TimerControllers from './timer-controllers.js'

export class Controllers {
  constructor (localConfig = {}) {
    this.adapters = new Adapters()
    this.useCases = new UseCases({ adapters: this.adapters })
    this.timerControllers = new TimerControllers({ adapters: this.adapters, useCases: this.useCases })
  }

  async initAdapters () {
    await this.adapters.startAdapters()
  }

  async initUseCases () {
    await this.useCases.startUseCases()
  }

  attachRESTControllers (app) {
    const restControllers = new RESTControllers({
      adapters: this.adapters,
      useCases: this.useCases
    })

    restControllers.attachRESTControllers(app)
  }
}

export default Controllers
