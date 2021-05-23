/*
  This sets common configuration settings used by the rest of the app. Most
  values are loaded from environment variables. It is assumed this app will
  be started by a bash shell script that will set these environment variables.
*/

const BCHJS = require('@psf/bch-js')

// Establish the network, default to 'mainnet'
const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'mainnet'

let configOut = {}

// Normal mainnet wallet.
configOut = {
  NETWORK: NETWORK,
  port: process.env.PORT || 5000,
  logPass: process.env.LOGPASS ? process.env.LOGPASS : 'test',

  // These variables determine the exchange rate curve.
  TOKENS_QTY_ORIGINAL: 50000,
  BCH_QTY_ORIGINAL: 250,

  // Email notifications settings.
  useEmailAlerts: process.env.USE_EMAIL_ALERTS
    ? Number.parseInt(process.env.USE_EMAIL_ALERTS)
    : 0,
  emailServer: process.env.EMAILSERVER
    ? process.env.EMAILSERVER
    : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER
    ? process.env.EMAILUSER
    : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS
    ? process.env.EMAILPASS
    : 'emailpassword',
  emailRecievers: process.env.EMAILRECIEVERS
    ? process.env.EMAILRECIEVERS.split(',')
    : ['test@test.com'],

  // Required BCH variables.
  BCH_ADDR: process.env.BCH145ADDR, // TODO: Phase out this var name.
  BCH145ADDR: process.env.BCH145ADDR,
  SLP145ADDR: process.env.SLP145ADDR,
  BCH245ADDR: process.env.BCH245ADDR,
  SLP_ADDR: process.env.SLP245ADDR, // TODO: Phase out this var name.
  SLP245ADDR: process.env.SLP245ADDR,
  SLP_TOKEN_ID: process.env.SLP_TOKEN_ID,

  // bch-js settings.
  MAINNET_REST: process.env.REST_URL || 'https://bchn.fullstack.cash/v4/',
  BCHLIB: BCHJS
}

module.exports = configOut
