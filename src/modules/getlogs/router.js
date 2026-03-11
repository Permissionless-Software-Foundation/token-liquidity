/*
  Route handler for the /logs endpoint.
*/

import * as logs from './controller.js'

export const baseUrl = '/logs'

export const routes = [
  {
    method: 'GET',
    route: '/',
    handlers: [
      logs.getLogs
    ]
  }
]
