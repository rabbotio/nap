const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

// - - - - - - Extra fields - - - - - -

let _extraUserSchema = {}
try {
  const { extraUserSchema } = require('./custom')
  _extraUserSchema = extraUserSchema
} catch (err) { err }

// - - - - - - Default fields - - - - - -

const ProviderSchema = new mongoose.Schema(
  {
    id: String,
    token: String
  },
  {
    _id: false, // disable `_id` field for `Provider` schema
  }
)

const UserSchemaObject = {
  name: String,
  last_name: String,
  first_name: String,
  email: String,
  token: String,
  status: String,
  hashed_password: String,
  verified: { type: 'boolean', default: false },
  verifiedAt: { type: Date },
  phones: String,
  facebook: { type: ProviderSchema },
  twitter: { type: ProviderSchema },
  google: { type: ProviderSchema },
  github: { type: ProviderSchema },
  role: { type: String, default: 'user' },
}

const UserSchema = new mongoose.Schema(
  Object.assign(
    UserSchemaObject,
    _extraUserSchema
  ), {
    timestamps: true,
  }
)

// - - - - - - Plugins - - - - - -
// User roles
const role = require('mongoose-role')
UserSchema.plugin(role, {
  roles: ['public', 'user', 'admin'],
  accessLevels: {
    'public': ['public', 'user', 'admin'],
    'anon': ['public'],
    'user': ['user', 'admin'],
    'admin': ['admin']
  }
})

const User = mongoose.model('User', UserSchema)
const UserTC = composeWithMongoose(User)

const Provider = mongoose.model('Provider', ProviderSchema)

const createUser = userData => new Promise((resolve, reject) => {
  userData = Object.assign(userData, { role: 'user' })

  User.create(userData, (err, result) => {
    // Error?
    err && debug.error(err) && reject(err)
    // Succeed
    resolve(result)
  })
})

UserTC.addResolver({
  name: 'user',
  kind: 'query',
  type: UserTC,
  resolve: ({ context }) => new Promise(async (resolve, reject) => {
    // Guard
    if (!context.nap.currentUser) {
      return reject(new Error('No session found'))
    }

    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    const user = await new Promise((resolve, reject) => User.findById(context.nap.currentUser.userId, (err, result) => err ? reject(err) : resolve(result)))
    // Fail
    if (!user) {
      return onError(new Error('User not exist'))      
    }

    // Succeed
    return resolve(user)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { User, UserTC, Provider, createUser }
