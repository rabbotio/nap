const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

module.exports = (config) => {
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
    verified: { type: 'boolean', default: false },
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
      config.extendUserSchema || {}
    ), {
      timestamps: true,
    }
  )

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
  return { User, UserTC, Provider, createUser };
};