
const config = require('../../../config')

// const lib = require('../../lib/token-util')
const TLUtils = require('../../lib/util')
const tlUtils = new TLUtils()

const TokenLiquidity = require('../../lib/token-liquidity')
const tokenApp = new TokenLiquidity()

// Used for debugging and iterrogating JS objects.
const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

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
async function getPrice (ctx) {
  // Read the current state
  const filename = `${__dirname.toString()}/../../../state/state.json`
  const state = tlUtils.readState(filename)
  // console.log(`state: ${JSON.stringify(state, null, 2)}`)

  // Calculate the current exchange rate of tokens for 1 BCH.
  const obj = {
    bchIn: 1.0,
    bchBalance: state.bchBalance,
    bchOriginalBalance: config.BCH_QTY_ORIGINAL,
    tokenOriginalBalance: config.TOKENS_QTY_ORIGINAL
  }
  const tokensFor1BCH = tokenApp.exchangeBCHForTokens(obj)
  // console.log(`tokensFor1BCH: ${util.inspect(tokensFor1BCH)}`)

  // Calculate exchange rate spot price.;
  // The old way. I think this is wrong.
  // const marketCap = state.usdPerBCH * state.bchBalance
  // const price = tlUtils.round8(marketCap / state.tokenBalance)
  // The new way. I think this is more accurate.
  const price = tlUtils.round8(state.usdPerBCH / tokensFor1BCH.tokensOut)

  // const retObj = {
  //  bchPrice:
  // }

  // Get the effective token balance:
  const effBal = tokenApp.getEffectiveTokenBalance(state.bchBalance)

  ctx.body = {
    usdPerBCH: state.usdPerBCH,
    bchBalance: state.bchBalance,
    // tokenBalance: state.tokenBalance,
    tokenBalance: effBal,
    usdPerToken: price
  }
}

module.exports = {
  getPrice
}
