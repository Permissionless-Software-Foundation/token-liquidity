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
const Wallet = require('./wallet')
const BCH = require('./bch')
const Transactions = require('./transactions')

// const ONE_HOUR = 60000 * 60
const ONE_HOUR = 60000 * 1

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
    this.wallet = new Wallet()

    _this = this
  }

  // Startup any asynchronous processes needed to initialize the adapter libraries.
  async startAdapters () {
    try {
      if (this.config.env !== 'test') {
        // Get a JWT token from FullStack.cash and update the BCHJSTOKEN environment
        // variable.
        const apiToken = await this.fullstack.getJwt()

        // Start an interval to renew the JWT token.
        this.fullstackInterval = setInterval(this.refreshBchJS, ONE_HOUR)

        // Initialize the wallet
        await this.wallet.initWallet(this.config.mnemonic, apiToken)

        // Display balances of wallet.
        const balance = await this.wallet.getBalances()
        console.log(`Wallet balances: ${JSON.stringify(balance, null, 2)}`)
      }
    } catch (err) {
      console.error('Error in adapters/index.js/startAdapters()')
      throw err
    }
  }

  // Called by a timer interval, in order to refresh the FullStack.cash JWT
  // tokens and re-instantiate any libraries that use bch-js.
  async refreshBchJS () {
    // Renew the FullStack.cash JWT token.
    const apiToken = await _this.fullstack.getJwt()

    // Update the adapter libraries that depend on bch-js.
    await _this.renewBchJS(apiToken)
  }

  // Refresh the libraries that rely on bch-js, after the FullStack.cash JWT
  // token has been renewed.
  async renewBchJS (apiToken) {
    // Reinitialize wallet with the new apiToken.
    await _this.wallet.initWallet(this.config.mnemonic, apiToken)

    // Extract bch-js from the wallet library.
    const bchjs = _this.wallet.bchjs

    // Re-initialized support Adapters that use bch-js
    this.bch = new BCH({ bchjs })
    this.txs = new Transactions({ bchjs })

    this.wlogger.info('FullStack JWT token refreshed and libraries updated.')
  }
}

module.exports = Adapters
