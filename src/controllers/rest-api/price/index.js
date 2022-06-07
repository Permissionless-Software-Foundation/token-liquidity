// Public npm libraries.
const Router = require('koa-router')

// Local libraries.
const PriceRESTControllerLib = require('./controller')
// const Validators = require('../../../middleware/validators')

let _this

class PriceRouter {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters

    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Price REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Price REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }
    // Encapsulate dependencies.
    this.priceRESTController = new PriceRESTControllerLib(dependencies)
    // this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/price'
    this.router = new Router({ prefix: baseUrl })

    _this = this
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.get('/', this.getPrice)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }

  async getPrice (ctx, next) {
    // await _this.validators.ensureUser(ctx, next)
    await _this.priceRESTController.getPrice(ctx, next)
  }
}

module.exports = PriceRouter
