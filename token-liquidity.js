import server from './bin/server.js'
// import { startTokenLiquidity } from './bin/token-liquidity.js'

async function startServer () {
  await server.startServer()
  // await startTokenLiquidity()
}

startServer()
