/*
  Mocks for the Adapter library.
*/

const BchWallet = require('minimal-slp-wallet/index')

const config = require('../../../../config')

const localdb = {
  Users: class Users {
    static findById () {}
    static find () {}
    static findOne () {
      return {
        validatePassword: localdb.validatePassword
      }
    }

    async save () {
      return {}
    }

    generateToken () {
      return '123'
    }

    toJSON () {
      return {}
    }

    async remove () {
      return true
    }

    async validatePassword () {
      return true
    }
  },

  validatePassword: () => {
    return true
  }
}

const bch = {
  getTransactions: () => {},
  justTxs: () => {},
  recievedBch: () => {}
}

const txs = {
  getTxConfirmations: () => {},
  getUserAddr2: () => {}
}

const slpWallet = new BchWallet(undefined, { noUpdate: true })

const wallet = {
  wallet: slpWallet,
  bchjs: slpWallet.bchjs,
  getBalances: () => {
    return {
      sats: 100000,
      tokens: [{ tokenId: config.slpTokenId, qty: 10000 }]
    }
  },
  sendTokens: () => {}
}

const wlogger = {
  info: () => {},
  debug: () => {},
  error: () => {}
}

const slp = {
  tokenTxInfo: () => {}
}

module.exports = { localdb, bch, txs, wallet, wlogger, slp }
