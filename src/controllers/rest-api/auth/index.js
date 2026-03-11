/*
  REST API library for auth route.
*/

import Router from 'koa-router'
import AuthRESTController from './controller.js'

export class AuthRouter {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating PostEntry REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating PostEntry REST Controller.'
      )
    }

    this.authRESTController = new AuthRESTController(localConfig)

    const baseUrl = '/auth'
    this.router = new Router({ prefix: baseUrl })
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attached REST API controllers.'
      )
    }

    this.router.post('/', this.authRESTController.authUser)

    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

export default AuthRouter
