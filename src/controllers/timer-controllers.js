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

    _this = this

    this.startTimers()
  }

  // Start all the time-based controllers.
  startTimers () {
    setInterval(this.checkForNewTxs, 60000 * 0.6)
  }

  // Poll the apps wallet address to see if new trades have come in.
  checkForNewTxs () {
    try {
      _this.useCases.tlMain.trade.checkForNewTxs()
    } catch (err) {
      // Do not throw an error. This is a top-level function.
      console.log('Error in timer-controllers.js/checkForNewTxs(): ', err)
    }
  }
}

module.exports = TimerControllers
