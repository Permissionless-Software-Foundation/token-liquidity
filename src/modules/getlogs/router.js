/*
  Route handler for the /logs endpoint.
*/

const logs = require('./controller')

// export const baseUrl = '/users'
module.exports.baseUrl = '/logs'

module.exports.routes = [
  {
    method: 'GET',
    route: '/',
    handlers: [
      logs.getLogs
    ]
  }
]
