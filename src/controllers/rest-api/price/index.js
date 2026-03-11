// Public npm libraries.
import Router from 'koa-router'

// Local libraries.
import PriceRESTControllerLib from './controller.js'
// const Validators = require('../../../middleware/validators')

let _this

export class PriceRouter {
  constructor (localConfig = {}) {
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
    this.priceRESTController = new PriceRESTControllerLib(dependencies)

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

    this.router.get('/', this.getPrice)

    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }

  async getPrice (ctx, next) {
    await _this.priceRESTController.getPrice(ctx, next)
  }
}

export default PriceRouter
