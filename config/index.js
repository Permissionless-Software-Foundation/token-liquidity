import common from './env/common.js'
import bchjs from './bchjs.js'
import development from './env/development.js'
import test from './env/test.js'
import production from './env/production.js'

const envConfigs = {
  development,
  test,
  production
}

const env = process.env.TL_ENV || 'development'
console.log(`Starting ${env} environment`)

const config = Object.assign({}, envConfigs[env])
config.env = env

const macroConfig = Object.assign({}, bchjs, common, config)
// console.log('macroConig: ', macroConfig)

export default macroConfig
