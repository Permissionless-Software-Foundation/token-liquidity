import mongoose from 'mongoose'
import config from '../../config/index.js'
import User from '../../src/adapters/localdb/models/users.js'

const EMAIL = 'test@test.com'
const PASSWORD = 'pass'

async function addUser () {
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true)
  await mongoose.connect(
    config.database,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  const userData = {
    email: EMAIL,
    password: PASSWORD
  }

  const user = new User(userData)
  user.type = 'user'

  await user.save()
  await mongoose.connection.close()

  console.log(`User ${EMAIL} created.`)
}
addUser()

export { addUser }
