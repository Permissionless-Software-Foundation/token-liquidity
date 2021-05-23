/*
  This isn't really a 'test'. Instead it maps out the values produced by the
  exchangeTokensForBCH() function so that they can be plotted in a spreadsheet
  and analyzed for errors.

  The output of this program can be compared to the tokens-for-bch sheet in the
  token-math-examples.ods spreadsheet.

  This is a newer map using the hybrid curve and 250 BCH as the inflection point.
*/

const TokenLiquidity = require('../../src/lib/token-liquidity')
const lib = new TokenLiquidity()

const BCH_QTY_ORIGINAL = 250.0
const TOKENS_QTY_ORIGINAL = 50000.0

// 2-d array. Format: [bchBalance, tokensIn]
const bchBalanceTokensIn = [
  [1250, 20000],
  [1150, 20000],
  [1050, 20000],
  [950, 20000],
  [850, 20000],
  [750, 20000],
  [650, 20000],
  [550, 20000],
  [450, 20000],
  [350, 20000],
  [250, 20000],
  [167.58001150891, 20000],
  [112.332241029305, 20000],
  [75.2985529780505, 20000],
  [50.4741294986639, 20000],
  [33.8338208091532, 20000],
  [10, 20000],
  [5, 20000],
  [2, 20000],
  [1, 20000]
]

// map out the exchangeTokensForBCH() function
function runTest () {
  try {
    // Loop through linear increases in BCH.
    for (let i = 0; i < bchBalanceTokensIn.length; i++) {
      const data = bchBalanceTokensIn[i]

      const bchBalance = data[0]
      const tokensIn = data[1]

      const obj = {
        tokenIn: tokensIn,
        bchBalance,
        bchOriginalBalance: BCH_QTY_ORIGINAL,
        tokenOriginalBalance: TOKENS_QTY_ORIGINAL
      }

      const bchOut = lib.exchangeTokensForBCH(obj)

      console.log(
        `bch1: ${bchBalance}, tokensIn: ${tokensIn}, bch2: ${
          bchOut.bch2
        }, bchOut: ${bchOut.bchOut}`
      )
    }
  } catch (err) {
    console.log('Error in runTest(): ', err)
  }
}

runTest()
