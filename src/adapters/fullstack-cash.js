/*
  An adapter library for dealing with FullStack.cash JWT tokens.
*/

import JwtLib from 'jwt-bch-lib'

import config from '../../config/index.js'
import wlogger from './wlogger.js'

class FullStack {
  constructor (localConfig = {}) {
    this.jwtLib = new JwtLib({
      server: config.fullstackAuthServer,
      login: config.fullstackLogin,
      password: config.fullstackPass
    })
    this.config = config
    this.apiToken = ''
  }

  async getJwt () {
    try {
      if (!this.config.getAPITokenAtStartup) {
        this.apiToken = ''
        return this.apiToken
      }

      await this.jwtLib.register()

      let apiToken = this.jwtLib.userData.apiToken

      const isValid = await this.jwtLib.validateApiToken()

      if (!isValid.isValid) {
        apiToken = await this.jwtLib.getApiToken(this.jwtLib.userData.apiLevel)
        wlogger.info('The JWT token was not valid. Retrieved new JWT token.\n')
      } else {
        console.log(' ')
        wlogger.info('Valid JWT token retrieved from FullStack.cash\n')
      }

      process.env.BCHJSTOKEN = apiToken
      this.apiToken = apiToken

      return apiToken
    } catch (err) {
      wlogger.error('Error in fullstack-cash.js/getJwt(): ', err)
      throw err
    }
  }
}

export default FullStack
