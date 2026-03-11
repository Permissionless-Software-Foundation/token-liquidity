// User database model.
// const User = require('../../../adapters/localdb/models/users')

// User library for business logic.
// const UserLib = require('../../../adapters/users')

import wlogger from '../../../adapters/wlogger.js'

let _this
export class UserRESTControllerLib {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /users REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /users REST Controller.'
      )
    }

    this.UserModel = this.adapters.localdb.Users

    _this = this
  }

  /**
   * @api {post} /users Create a new user
   * @apiPermission user
   * @apiName CreateUser
   * @apiGroup Users
   */
  async createUser (ctx) {
    try {
      const userObj = ctx.request.body.user

      const { userData, token } = await _this.useCases.user.createUser(userObj)

      ctx.body = {
        user: userData,
        token
      }
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /users Get all users
   * @apiPermission user
   * @apiName GetUsers
   * @apiGroup Users
   */
  async getUsers (ctx) {
    try {
      const users = await _this.useCases.user.getAllUsers()

      ctx.body = { users }
    } catch (err) {
      wlogger.error('Error in users/controller.js/getUsers(): '.err)
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /users/:id Get user by id
   * @apiPermission user
   * @apiName GetUser
   * @apiGroup Users
   */
  async getUser (ctx, next) {
    try {
      const user = await _this.useCases.user.getUser(ctx.params)

      ctx.body = {
        user
      }
    } catch (err) {
      _this.handleError(ctx, err)
    }
    if (next) {
      return next()
    }
  }

  /**
   * @api {put} /users/:id Update a user
   * @apiPermission user
   * @apiName UpdateUser
   * @apiGroup Users
   */
  async updateUser (ctx) {
    try {
      const existingUser = ctx.body.user
      const newData = ctx.request.body.user

      const user = await _this.useCases.user.updateUser(existingUser, newData)

      ctx.body = {
        user
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {delete} /users/:id Delete a user
   * @apiPermission user
   * @apiName DeleteUser
   * @apiGroup Users
   */
  async deleteUser (ctx) {
    try {
      const user = ctx.body.user

      await _this.useCases.user.deleteUser(user)

      ctx.status = 200
      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  handleError (ctx, err) {
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      ctx.throw(422, err.message)
    }
  }

  async validateEmail (email) {
    // eslint-disable-next-line no-useless-escape
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true
    }
    return false
  }
}

export default UserRESTControllerLib
