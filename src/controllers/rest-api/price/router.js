// const ensureUser = require('../../middleware/validators')
const price = require('./controller')

// export const baseUrl = '/users'
module.exports.baseUrl = '/price'

module.exports.routes = [
  {
    method: 'GET',
    route: '/',
    handlers: [
      price.getPrice
    ]
  }
]
