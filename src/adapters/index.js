/*
  This is a top-level library that encapsulates all the additional Adapters.
  The concept of Adapters comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Load individual adapter libraries.
const LocalDB = require('./localdb')
const LogsAPI = require('./logapi')
const Passport = require('./passport')
const Nodemailer = require('./nodemailer')
const wlogger = require('./wlogger')
const JSONFiles = require('./json-files')
const config = require('../../config')
const FullStack = require('./fullstack-cash')

const ONE_HOUR = 60000 * 60
// const ONE_HOUR = 60000 * 1

let _this

class Adapters {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.localdb = new LocalDB()
    this.logapi = new LogsAPI()
    this.passport = new Passport()
    this.nodemailer = new Nodemailer()
    this.jsonFiles = new JSONFiles()
    this.config = config
    this.wlogger = wlogger
    this.fullstack = new FullStack()

    _this = this
  }

  // Startup any asynchronous processes needed to initialize the adapter libraries.
  async startAdapters () {
    try {
      if (this.config.env !== 'test') {
        // Get a JWT token from FullStack.cash and update the BCHJSTOKEN environment
        // variable.
        await this.fullstack.getJwt()

        // Start an interval to renew the JWT token.
        this.fullstackInterval = setInterval(this.refreshBchJS, ONE_HOUR)
      }

      // Update any adapters that depend on bch-js.
      this.renewBchJS()
    } catch (err) {
      console.error('Error in adapters/index.js/startAdapters()')
      throw err
    }
  }

  async refreshBchJS () {
    // Renew the FullStack.cash JWT token.
    await _this.fullstack.getJwt()

    // Update the adapter libraries that depend on bch-js.
    _this.renewBchJS()
  }

  // Refresh the libraries that rely on bch-js, after the FullStack.cash JWT
  // token has been renewed.
  renewBchJS () {
    // this.memo = new Memo({bchjs})
    // this.metadata = new MetaData()
    // this.project = new Project()
    // this.tokens = new Tokens()

    this.wlogger.info('FullStack JWT token refreshed and libraries updated.')
  }
}

module.exports = Adapters
