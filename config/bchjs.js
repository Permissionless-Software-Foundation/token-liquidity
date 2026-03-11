/*
  Configuration settings for bch-js and bch-api.
*/

// default rest API.
import BCHJS from '@psf/bch-js'

let RESTAPI = 'fullstack.cash'
// let RESTAPI = 'bitcoin.com'

// Override the RESTAPI setting if envronment variable is set.
if (process.env.RESTAPI && process.env.RESTAPI !== '') {
  RESTAPI = process.env.RESTAPI
}

// Ensure bch-js can pick up the env var.
process.env.RESTAPI = RESTAPI
// const BITBOX = require('slp-sdk')

const config = {}

if (RESTAPI === 'fullstack.cash') {
  // config.BCHLIB = BCHJS.BitboxShim()
  config.BCHLIB = BCHJS
  config.MAINNET_REST = 'https://bchn.fullstack.cash/v4/'
  config.TESTNET_REST = 'https://testnet3.fullstack.cash/v4/'
  config.RESTAPI = 'fullstack.cash'
}

// Use bch-js with local infrastructure.
if (RESTAPI === 'local') {
  config.BCHLIB = BCHJS.BitboxShim()
  // config.MAINNET_REST = `http://192.168.0.36:12400/v3/`
  // config.TESTNET_REST = `http://192.168.0.38:13400/v3/`
  config.MAINNET_REST = 'http://127.0.0.1:3000/v4/'
  config.TESTNET_REST = 'http://decatur.hopto.org:13400/v4/'
  config.RESTAPI = 'local'
}

// Use bch-js with decatur infrastructure.
if (RESTAPI === 'decatur') {
  config.BCHLIB = BCHJS.BitboxShim()
  config.MAINNET_REST = 'http://decatur.hopto.org:12400/v4/'
  config.TESTNET_REST = 'http://decatur.hopto.org:13400/v4/'
  config.RESTAPI = 'decatur'
}

export default config
