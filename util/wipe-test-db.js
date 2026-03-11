/*
  Utility app to wipe the test database.
*/

import mongoose from 'mongoose'
import config from '../config/index.js'

// Force test environment
process.env.KOA_ENV = 'test'

async function cleanDb () {
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true)
  await mongoose.connect(config.database, { useNewUrlParser: true })

  console.log(`mongoose.connection.collections: ${JSON.stringify(mongoose.connection.collections, null, 2)}`)

  for (const collection in mongoose.connection.collections) {
    const collections = mongoose.connection.collections
    if (collections.collection) {
      await collection.deleteMany()
    }
  }

  mongoose.connection.close()
}
cleanDb()
