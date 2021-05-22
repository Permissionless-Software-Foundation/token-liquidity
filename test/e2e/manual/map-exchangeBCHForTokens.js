/*
  This isn't really a 'test'. Instead it maps out the values produced by the
  exchangeBCHForTokens() function so that they can be plotted in a spreadsheet
  and analyzed for errors.

  The output of this program can be compared to the bch-for-tokens sheet in the
  token-math-examples.ods spreadsheet.

  This is a newer map using the hybrid curve and 250 BCH as the inflection point.
*/

const TokenLiquidity = require('../../src/lib/token-liquidity')
const lib = new TokenLiquidity()

const BCH_QTY_ORIGINAL = 250.0
const TOKENS_QTY_ORIGINAL = 50000.0

// 2-d array. Format: [bchBalance, bchIn]
const bchBalanceBchIn = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [10, 10],
  [20, 10],
  [30, 20],
  [50, 30],
  [80, 20],
  [100, 50],
  [150, 50],
  [200, 50],
  [250, 50],
  [300, 50],
  [350, 50],
  [400, 50],
  [450, 50]
]

function runTest2 () {
  try {
    for (let i = 0; i < bchBalanceBchIn.length; i++) {
      const data = bchBalanceBchIn[i]

      const bchBalance = data[0]
      const bchIn = data[1]
      // console.log(`bchBalance: ${bchBalance}, bchIn: ${bchIn}`)

      const obj = {
        bchBalance: bchBalance,
        bchIn: bchIn,
        bchOriginalBalance: BCH_QTY_ORIGINAL,
        tokenOriginalBalance: TOKENS_QTY_ORIGINAL
      }

      const tokenInfo = lib.exchangeBCHForTokens(obj)

      console.log(
        `balance (bch1): ${bchBalance}, bchIn: ${bchIn}, token2: ${
          tokenInfo.token2
        }, tokenOut: ${tokenInfo.tokensOut}, bch2: ${tokenInfo.bch2}`
      )
    }
  } catch (err) {
    console.error('Error in runTest2: ', err)
  }
}
runTest2()
