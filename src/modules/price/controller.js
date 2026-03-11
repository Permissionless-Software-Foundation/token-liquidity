import { fileURLToPath } from 'url'
import path from 'path'
import util from 'util'
import config from '../../../config/index.js'
import TLUtils from '../../adapters/util.js'

import TokenLiquidity from '../../adapters/token-liquidity.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tlUtils = new TLUtils()
const tokenApp = new TokenLiquidity()

util.inspect.defaultOptions = { depth: 1 }

/**
 * @api {get} /price Get spot price of PSF token
 * @apiPermission anonymous
 * @apiVersion 1.0.0
 * @apiName GetPrice
 * @apiGroup Price
 */
export async function getPrice (ctx) {
  const filename = path.join(__dirname, '../../../state/state.json')
  const state = tlUtils.readState(filename)

  const obj = {
    bchIn: 1.0,
    bchBalance: state.bchBalance,
    bchOriginalBalance: config.BCH_QTY_ORIGINAL,
    tokenOriginalBalance: config.TOKENS_QTY_ORIGINAL
  }
  const tokensFor1BCH = tokenApp.exchangeBCHForTokens(obj)

  const price = tlUtils.round8(state.usdPerBCH / tokensFor1BCH.tokensOut)

  const effBal = tokenApp.getEffectiveTokenBalance(state.bchBalance)

  ctx.body = {
    usdPerBCH: state.usdPerBCH,
    bchBalance: state.bchBalance,
    tokenBalance: effBal,
    usdPerToken: price
  }
}
