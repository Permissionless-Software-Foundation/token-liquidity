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

const AdminLib = require('../src/adapters/admin')
const adminLib = new AdminLib()

const errorMiddleware = require('../src/middleware')
const wlogger = require('../src/adapters/wlogger')

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

  // Start Adapters libraries, and attach Controller libraries (Clean Architecture).
  const Controllers = require('../src/controllers')
  const controllers = new Controllers()
  await controllers.initAdapters()
  await controllers.initUseCases()
  await controllers.attachRESTControllers(app)

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

  return app
}
// startServer()

// export default app
// module.exports = app
module.exports = {
  startServer
}
