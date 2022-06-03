/*
  Create and launch the koa web server.
*/

// npm libraries
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const session = require('koa-generic-session')
const passport = require('koa-passport')
const mount = require('koa-mount')
const serve = require('koa-static')
const cors = require('kcors')

// Local libraries
const config = require('../config') // this first.

const AdminLib = require('../src/lib/admin')
const adminLib = new AdminLib()

const errorMiddleware = require('../src/middleware')

// Winston logger
const wlogger = require('../src/lib/wlogger')

async function startServer () {
  console.log(`Using network: ${config.NETWORK}`)

  // Create a Koa instance.
  const app = new Koa()
  app.keys = [config.session]

  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(config.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  // MIDDLEWARE START

  app.use(convert(logger()))
  app.use(bodyParser())
  app.use(session())
  app.use(errorMiddleware())

  // Used to generate the docs.
  app.use(mount('/', serve(`${process.cwd()}/docs`)))

  // Mount the page for displaying logs.
  app.use(mount('/logs', serve(`${process.cwd()}/config/logs`)))

  // User Authentication
  require('../config/passport')
  app.use(passport.initialize())
  app.use(passport.session())

  // Custom Middleware Modules
  const modules = require('../src/modules')
  modules(app)

  // Enable CORS for testing
  app.use(cors({ origin: '*' }))

  // MIDDLEWARE END

  console.log(`Running server in environment: ${config.env}`)
  wlogger.info(`Running server in environment: ${config.env}`)

  await app.listen(config.port)
  console.log(`Server started on ${config.port}`)
  wlogger.info(`Server started on ${config.port}`)

  // Create the system admin user.
  const success = await adminLib.createSystemUser()
  if (success) console.log('System admin user created.')

  // Restart the app every 24 hours
  const TWENTY_FOUR_HOURS = 60000 * 60 * 24
  // const TWENTY_FOUR_HOURS = 5000
  setInterval(function() {
    console.log('Exiting after 24 hours. Depending on pm2 to restart the app.')
    process.exit()
  }, TWENTY_FOUR_HOURS)

  return app
}
// startServer()

// export default app
// module.exports = app
module.exports = {
  startServer
}
