/*
  An adapter library for dealing with FullStack.cash JWT tokens.
*/

// Global npm libraries
const JwtLib = require('jwt-bch-lib')

// Local libraries
const config = require('../../config')
const wlogger = require('./wlogger')

class FullStack {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.jwtLib = new JwtLib({
      // Overwrite default values with the values in the config file.
      server: config.fullstackAuthServer,
      login: config.fullstackLogin,
      password: config.fullstackPass
    })
    this.config = config
  }

  // Get's a JWT token from FullStack.cash
  // This code based on the jwt-bch-demo:
  // https://github.com/Permissionless-Software-Foundation/jwt-bch-demo
  async getJwt () {
    try {
      // Log into the auth server.
      await this.jwtLib.register()

      let apiToken = this.jwtLib.userData.apiToken

      // Ensure the JWT token is valid to use.
      const isValid = await this.jwtLib.validateApiToken()

      // Get a new token with the same API level, if the existing token is not
      // valid (probably expired).
      if (!isValid.isValid) {
        apiToken = await this.jwtLib.getApiToken(this.jwtLib.userData.apiLevel)
        wlogger.info('The JWT token was not valid. Retrieved new JWT token.\n')
      } else {
        console.log(' ')
        wlogger.info('Valid JWT token retrieved from FullStack.cash\n')
      }

      // Set the environment variable.
      process.env.BCHJSTOKEN = apiToken
      this.apiToken = apiToken

      return apiToken
    } catch (err) {
      wlogger.debug('Error in fullstack-cash.js/getJwt(): ', err)
      throw err
    }
  }
}

module.exports = FullStack
