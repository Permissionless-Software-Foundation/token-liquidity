/*
  Mocks for the Adapter library.
*/

const BchWallet = require('minimal-slp-wallet/index')

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
  justTxs: () => {}
}

const txs = {
  getTxConfirmations: () => {}
}

const wallet = {
  wallet: new BchWallet(undefined, { noUpdate: true })
}

module.exports = { localdb, bch, txs, wallet }
