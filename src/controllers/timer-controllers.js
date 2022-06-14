/*
  This Controller library is concerned with timer-based functions that are
  kicked off periodicially.
*/

// Used to retain scope of 'this', when the scope is lost.
let _this

class TimerControllers {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Timer Controller libraries.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Timer Controller libraries.'
      )
    }

    this.debugLevel = localConfig.debugLevel

    this.state = {
      newTxCheckTime: 60000 * 2
    }

    // Constants manipulated by unit tests
    this.timeBetweenTXs = 60000 * 5

    _this = this

    this.startTimers()
  }

  // Start all the time-based controllers.
  startTimers () {
    this.state.newTxCheckInterval = setInterval(this.checkForNewTxs, this.state.newTxCheckTime)
  }

  // Poll the apps wallet address to see if new trades have come in.
  async checkForNewTxs () {
    try {
      // Exit if the app is not yet ready to process transactions.
      // Note: This should be the first command.
      if (!_this.useCases.tlMain.state.appReady) return 1

      // Disable the timer interval while processing.
      // Note: This should be the second command.
      clearInterval(_this.state.newTxCheckInterval)

      const seenTxs = _this.useCases.tlMain.state.seenTxs

      const newTxs = await _this.useCases.tlMain.trade.checkForNewTxs(seenTxs)
      // console.log(`newTxs: ${JSON.stringify(newTxs, null, 2)}`)

      // Process any new transactions.
      if (newTxs.length > 0) {
        console.log(`...${newTxs.length} new txs found!`)

        for (let i = 0; i < newTxs.length; i++) {
          console.log(`Timer Controller checkForNewTxs() processing TXID ${newTxs[i]}`)
          await _this.useCases.tlMain.handleNewTx(newTxs[i])

          // Wait a minimum amount of time between processing transactions.
          console.log(`Waiting ${_this.timeBetweenTXs / 60000} minutes between processing transactions.`)
          await _this.adapters.wallet.bchjs.Util.sleep(_this.timeBetweenTXs)
        }
      } else {
        console.log('...no new TXs found.')
      }

      // Enable timer interval after processing.
      _this.state.newTxCheckInterval = setInterval(_this.checkForNewTxs, _this.state.newTxCheckTime)

      return 2
    } catch (err) {
      // Enable timer interval after processing.
      _this.state.newTxCheckInterval = setInterval(_this.checkForNewTxs, _this.state.newTxCheckTime)

      // Do not throw an error. This is a top-level function.
      console.log('Error in timer-controllers.js/checkForNewTxs(): ', err)

      return false
    }
  }
}

module.exports = TimerControllers
