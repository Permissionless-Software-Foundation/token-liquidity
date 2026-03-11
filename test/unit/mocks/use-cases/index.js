/*
  Mocks for the use cases.
*/
/* eslint-disable */

class UserUseCaseMock {
  async createUser(userObj) {
    return {}
  }

  async getAllUsers() {
    return true
  }

  async getUser(params) {
    return true
  }

  async updateUser(existingUser, newData) {
    return true
  }

  async deleteUser(user) {
    return true
  }

  async authUser(login, passwd) {
    return {
      generateToken: () => {}
    }
  }
}

class TLMain {
  constructor() {
    this.state = {
      satBalance: 0,
      bchBalance: 0,
      tokenBalance: 0,
      effectiveTokenBalance: 0,
      usdPerBch: 200,
      seenTxs: [],
      appReady: false
    }

    this.trade = {
      checkForNewTxs: async () => []
    }

    this.updateState = async () => {}
    this.summarizeState = () => {}
  }

  handleNewTx() {
    return true
  }
}

class UseCasesMock {
  constructor(localConfig = {}) {
    this.user = new UserUseCaseMock()
    this.tlMain = new TLMain()
  }
}

export default UseCasesMock
