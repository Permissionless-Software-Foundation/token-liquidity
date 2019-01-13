// const User = require('../../models/users')

const lib = require('../../utils/token-util')

/**
 * @api {get} /users Get all users
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
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
 * @apiUse TokenError
 */
async function getPrice (ctx) {
  // Read the current state
  const filename = `${__dirname}/../../../state/state.json`
  const state = lib.readState(filename)
  // console.log(`state: ${JSON.stringify(state, null, 2)}`)

  // Calculate exchange rate spot price.;
  const marketCap = state.usdPerBCH * state.bchBalance
  const price = lib.testableComponents.round8(marketCap / state.tokenBalance)

  // const retObj = {
  //  bchPrice:
  // }

  // const users = await User.find({}, '-password')
  ctx.body = {
    usdPerBCH: state.usdPerBCH,
    bchBalance: state.bchBalance,
    tokenBalance: state.tokenBalance,
    usdPerToken: price
  }
}

module.exports = {
  getPrice
}
