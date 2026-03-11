// const ensureUser = require('../../middleware/validators')
import * as price from './controller.js'

export const baseUrl = '/price'

export const routes = [
  {
    method: 'GET',
    route: '/',
    handlers: [
      price.getPrice
    ]
  }
]
