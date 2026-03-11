import mongoose from 'mongoose'
import config from '../../config/index.js'
import User from '../../src/adapters/localdb/models/users.js'

// Force test environment
process.env.TL_ENV = 'test'

async function deleteUsers () {
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true)
  await mongoose.connect(config.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  const users = await User.find({}, '-password')
  for (let i = 0; i < users.length; i++) {
    const thisUser = users[i]
    await thisUser.remove()
  }

  mongoose.connection.close()
}

deleteUsers()
