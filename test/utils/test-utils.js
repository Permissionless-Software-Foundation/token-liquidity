/*
  Utility functions used to prepare the environment for tests.
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import axios from 'axios'
import config from '../../config/index.js'
import User from '../../src/adapters/localdb/models/users.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOCALHOST = `http://localhost:${config.port}`

function loadJson (filename) {
  const filePath = path.isAbsolute(filename) ? filename : path.resolve(__dirname, filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

// Remove all collections from the DB.
async function cleanDb () {
  for (const collection in mongoose.connection.collections) {
    const collections = mongoose.connection.collections
    if (collections.collection) {
      await collection.deleteMany()
    }
  }
}

// Delete all users in the database. This ensures there is no previous state
// to confuse tests.
async function deleteAllUsers () {
  try {
    const users = await User.find({}, '-password')
    for (let i = 0; i < users.length; i++) {
      const thisUser = users[i]
      await thisUser.remove()
    }
  } catch (err) {
    console.error('Error in test-utils.js/deleteAllUsers()')
  }
}

async function createUser (userObj) {
  try {
    const options = {
      method: 'POST',
      url: `${LOCALHOST}/users`,
      data: {
        user: {
          email: userObj.email,
          password: userObj.password,
          name: userObj.name
        }
      }
    }
    const result = await axios(options)
    return {
      user: result.data.user,
      token: result.data.token
    }
  } catch (err) {
    console.log(
      'Error in utils.js/createUser(): ' + JSON.stringify(err, null, 2)
    )
    throw err
  }
}

async function loginTestUser () {
  try {
    const options = {
      method: 'POST',
      url: `${LOCALHOST}/auth`,
      data: {
        email: 'test@test.com',
        password: 'pass'
      }
    }
    const result = await axios(options)
    return {
      token: result.data.token,
      user: result.data.user.username,
      id: result.data.user._id.toString()
    }
  } catch (err) {
    console.log(
      'Error authenticating test user: ' + JSON.stringify(err, null, 2)
    )
    throw err
  }
}

async function loginAdminUser () {
  try {
    const filename = path.join(__dirname, '../../config', `system-user-${config.env}.json`)
    const adminUserData = loadJson(filename)
    console.log(`adminUserData: ${JSON.stringify(adminUserData, null, 2)}`)
    const options = {
      method: 'POST',
      url: `${LOCALHOST}/auth`,
      data: {
        email: adminUserData.email,
        password: adminUserData.password,
        name: 'admin'
      }
    }
    const result = await axios(options)
    return {
      token: result.data.token,
      user: result.data.user.username,
      id: result.data.user._id.toString()
    }
  } catch (err) {
    console.log(
      'Error authenticating test admin user: ' + JSON.stringify(err, null, 2)
    )
    throw err
  }
}

async function getAdminJWT () {
  try {
    const filename = path.join(__dirname, '../../config', `system-user-${config.env}.json`)
    const adminUserData = loadJson(filename)
    return adminUserData.token
  } catch (err) {
    console.error('Error in test/utils.js/getAdminJWT()')
    throw err
  }
}

export {
  cleanDb,
  createUser,
  loginTestUser,
  loginAdminUser,
  getAdminJWT,
  deleteAllUsers
}
