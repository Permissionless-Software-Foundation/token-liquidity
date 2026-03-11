/*
  This index file for the Clean Architecture Controllers loads dependencies,
  creates instances, and attaches the controller to REST API endpoints for
  Koa.
*/

// Load the REST API Controllers.
import AuthRESTController from './auth/index.js'
import UserRouter from './users/index.js'
import ContactRESTController from './contact/index.js'
import LogsRESTController from './logapi/index.js'
import PriceRESTController from './price/index.js'

export class RESTControllers {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters

    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating REST Controller libraries.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating REST Controller libraries.'
      )
    }
  }

  attachRESTControllers (app) {
    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    const authRESTController = new AuthRESTController(dependencies)
    authRESTController.attach(app)

    const userRouter = new UserRouter(dependencies)
    userRouter.attach(app)

    const contactRESTController = new ContactRESTController(dependencies)
    contactRESTController.attach(app)

    const logsRESTController = new LogsRESTController(dependencies)
    logsRESTController.attach(app)

    const priceRESTController = new PriceRESTController(dependencies)
    priceRESTController.attach(app)
  }
}

export default RESTControllers
