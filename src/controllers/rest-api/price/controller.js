// User database model.
// const User = require('../../../adapters/localdb/models/users')

// User library for business logic.
// const UserLib = require('../../../adapters/users')

// const wlogger = require('../../../adapters/wlogger')

// let _this

class PriceRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /price REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /price REST Controller.'
      )
    }

    // Encapsulate dependencies
    // this.UserModel = this.adapters.localdb.Users
    // this.userLib = new UserLib()

    // _this = this
  }

  /**
   * @api {get} /price Get spot price of PSF token
   * @apiPermission anonymous
   * @apiVersion 1.0.0
   * @apiName GetPrice
   * @apiGroup Price
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/price
   *
   * @apiSuccess {Object[]} users           Array of user objects
   * @apiSuccess {ObjectId} users._id       User id
   * @apiSuccess {String}   users.name      User name
   * @apiSuccess {String}   users.username  User username
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "users": [{
   *          "_id": "56bd1da600a526986cf65c80"
   *          "name": "John Doe"
   *          "username": "johndoe"
   *       }]
   *     }
   *
   */
  async getPrice (ctx) {
    // Read the current state
    const state = this.useCases.tlMain.state

    const inObj = {
      bchQty: 1,
      state
    }
    const tokensFor1BCH = this.useCases.tlMain.trade.exchangeBCHForTokens(inObj)

    // Calculate exchange rate spot price.;
    const price = this.adapters.wallet.bchjs.Util.floor8(state.usdPerBch / tokensFor1BCH)

    // Get the effective token balance:
    const effBal = state.effectiveTokenBalance

    ctx.body = {
      usdPerBCH: state.usdPerBCH,
      bchBalance: state.bchBalance,
      tokenBalance: effBal,
      usdPerToken: price
    }
  }
}

module.exports = PriceRESTControllerLib
