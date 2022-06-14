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
  TOKENS_QTY_ORIGINAL: 25000,
  BCH_QTY_ORIGINAL: 125,

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
  emailMachineName: process.env.EMAIL_MACHINE
    ? process.env.EMAIL_MACHINE
    : 'Generic Token Liquidity App',

  // Required BCH variables.
  BCH_ADDR: process.env.BCH145ADDR ? process.env.BCH145ADDR : 'bitcoincash:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqqkw6cc65',
  BCH145ADDR: process.env.BCH145ADDR ? process.env.BCH145ADDR : 'bitcoincash:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqqkw6cc65',
  SLP145ADDR: process.env.SLP145ADDR ? process.env.SLP145ADDR : 'simpleledger:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqvd9pdcy2',
  BCH245ADDR: process.env.BCH245ADDR ? process.env.BCH245ADDR : 'bitcoincash:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqqkw6cc65',
  SLP_ADDR: process.env.SLP245ADDR ? process.env.SLP245ADDR : 'simpleledger:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqvd9pdcy2',
  SLP245ADDR: process.env.SLP245ADDR ? process.env.SLP245ADDR : 'simpleledger:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqvd9pdcy2',
  SLP_TOKEN_ID:
    process.env.SLP_TOKEN_ID ||
    'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
  slpTokenId:
    process.env.SLP_TOKEN_ID ||
    'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',

  // bch-js settings.
  MAINNET_REST: process.env.REST_URL || 'https://bchn.fullstack.cash/v5/',
  BCHLIB: BCHJS,
  getAPITokenAtStartup: !process.env.DO_NOT_GET_JWT,

  blockchain: process.env.BLOCKCHAIN ? process.env.BLOCKCHAIN : 'bch',

  fullstackAuthServer: process.env.FULLSTACK_AUTH ? process.env.FULLSTACK_AUTH : 'https://auth.fullstack.cash',
  fullstackLogin: process.env.FULLSTACKLOGIN ? process.env.FULLSTACKLOGIN : 'demo@demo.com',
  fullstackPass: process.env.FULLSTACKPASS ? process.env.FULLSTACKPASS : 'demo',

  // Placeholder. This expected to be overwritten by an environment variable.
  mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : 'drum salute decline increase earth cloth tobacco gospel appear motor fever soft'
}

module.exports = configOut
