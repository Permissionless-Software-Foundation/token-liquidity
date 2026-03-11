// User database model.
// const User = require('../../../adapters/localdb/models/users')

// User library for business logic.
// const UserLib = require('../../../adapters/users')

// const wlogger = require('../../../adapters/wlogger')

// let _this

export class PriceRESTControllerLib {
  constructor (localConfig = {}) {
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
  }

  /**
   * @api {get} /price Get spot price of PSF token
   * @apiPermission anonymous
   * @apiVersion 1.0.0
   * @apiName GetPrice
   * @apiGroup Price
   */
  async getPrice (ctx) {
    const state = this.useCases.tlMain.state

    const inObj = {
      bchQty: 1,
      state
    }
    const tokensFor1BCH = this.useCases.tlMain.trade.exchangeBCHForTokens(inObj)

    const price = this.adapters.wallet.bchjs.Util.floor8(state.usdPerBch / tokensFor1BCH)

    const effBal = state.effectiveTokenBalance

    ctx.body = {
      usdPerBCH: state.usdPerBch,
      bchBalance: state.bchBalance,
      tokenBalance: effBal,
      usdPerToken: price
    }
  }
}

export default PriceRESTControllerLib
