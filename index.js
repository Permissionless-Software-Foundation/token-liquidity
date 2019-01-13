const server = require('./bin/server.js')
const { startTokenLiquidity } = require('./bin/token-liquidity')

async function startServer () {
  await server.startServer()
  await startTokenLiquidity()
}

startServer()
