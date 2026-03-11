/*
  This library encapsulates code concerned with MongoDB and Mongoose models.
*/

import Users from './models/users.js'

class LocalDB {
  constructor () {
    this.Users = Users
  }
}

export default LocalDB
