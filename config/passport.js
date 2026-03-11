import passport from 'koa-passport'
import User from '../src/adapters/localdb/models/users.js'
import Strategy from 'passport-local'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, '-password')
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use('local', new Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) { return done(null, false) }

    try {
      const isMatch = await user.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, user)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
