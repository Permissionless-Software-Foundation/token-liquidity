import User from '../adapters/localdb/models/users.js'
import config from '../../config/index.js'
import getToken from '../adapters/auth.js'
import jwt from 'jsonwebtoken'
import wlogger from '../adapters/wlogger.js'

let _this

class Validators {
  constructor () {
    this.User = User
    this.getToken = getToken
    this.jwt = jwt
    this.config = config

    _this = this
  }

  async ensureUser (ctx, next) {
    try {
      const token = _this.getToken(ctx)

      if (!token) {
        ctx.throw(401)
      }

      let decoded = null
      try {
        decoded = _this.jwt.verify(token, config.token)
      } catch (err) {
        ctx.throw(401)
      }

      ctx.state.user = await _this.User.findById(decoded.id, '-password')
      if (!ctx.state.user) {
        ctx.throw(401)
      }

      return true
    } catch (error) {
      ctx.throw(401)
    }
  }

  async ensureAdmin (ctx, next) {
    try {
      const token = _this.getToken(ctx)

      if (!token) {
        ctx.throw(401)
      }

      let decoded = null
      try {
        decoded = _this.jwt.verify(token, config.token)
      } catch (err) {
        ctx.throw(401)
      }

      ctx.state.user = await _this.User.findById(decoded.id, '-password')
      if (!ctx.state.user) {
        ctx.throw(401)
      }

      if (ctx.state.user.type !== 'admin') {
        ctx.throw(401, 'not admin')
      }

      return true
    } catch (error) {
      ctx.throw(401, error.message)
    }
  }

  async ensureTargetUserOrAdmin (ctx, next) {
    try {
      const token = _this.getToken(ctx)

      if (!token) {
        ctx.throw(401)
      }

      const targetId = ctx.params.id

      let decoded = null
      try {
        decoded = _this.jwt.verify(token, config.token)
      } catch (err) {
        ctx.throw(401)
      }

      ctx.state.user = await _this.User.findById(decoded.id, '-password')
      if (!ctx.state.user) {
        ctx.throw(401)
      }

      if (ctx.state.user._id.toString() !== targetId.toString()) {
        wlogger.verbose(
          `Calling user and target user do not match! Calling user: ${
            ctx.state.user._id
          }, Target user: ${targetId}`
        )

        if (ctx.state.user.type !== 'admin') {
          ctx.throw(401, 'not admin')
        } else {
          wlogger.verbose('It\'s ok. The user is an admin.')
        }
      }

      return true
    } catch (error) {
      ctx.throw(401, error.message)
    }
  }
}

export default Validators
