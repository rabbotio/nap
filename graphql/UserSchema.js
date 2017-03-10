const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const ProviderSchema = new mongoose.Schema(
  {
    id: String,
    token: String
  },
  {
    _id: false, // disable `_id` field for `Provider` schema
  }
)

const UserSchema = new mongoose.Schema(
  {
    name: String,
    last_name: String,
    first_name: String,
    email: String,
    token: String,
    verified: { type: 'boolean', default: false },
    phones: String,
    facebook: { type: ProviderSchema },
    twitter: { type: ProviderSchema },
    google: { type: ProviderSchema },
    github: { type: ProviderSchema },
    role: { type: String, default: 'user' }
  },
  {
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
  debug.log(' * createUser :', userData)

  User.create(userData, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

/*
UserTC.addFields({
  error: {
    type: 'JSON',
    description: 'Error',
    resolve: (source, args, context) => ({ foo: 'bar'}),
  }
})
*/

// - - - - - - Exports - - - - - -

module.exports = { User, UserTC, Provider, createUser }
