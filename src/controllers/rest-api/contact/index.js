/*
  REST API library for /contact route.
*/

import Router from 'koa-router'
import ContactRESTControllerLib from './controller.js'

export class ContactRouter {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Contact REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Contact REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    this.contactRESTController = new ContactRESTControllerLib(dependencies)

    const baseUrl = '/contact'
    this.router = new Router({ prefix: baseUrl })
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    this.router.post('/email', this.contactRESTController.email)

    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

export default ContactRouter
