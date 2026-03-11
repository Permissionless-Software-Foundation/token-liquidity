/*
  REST API library for /logs route.
*/

import Router from 'koa-router'
import LogsRESTControllerLib from './controller.js'

export class LogsRouter {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Logs REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Logs REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    this.logsRESTController = new LogsRESTControllerLib(dependencies)

    const baseUrl = '/logapi'
    this.router = new Router({ prefix: baseUrl })
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    this.router.post('/', this.logsRESTController.getLogs)

    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

export default LogsRouter
