const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const { buildMongooseSchema } = require('./helpers')

module.exports = (extendedSchema) => {
  const ProviderSchema = new mongoose.Schema(
    {
      id: String,
      token: String,
      profile: {},
      isUnlink: Boolean
    },
    {
      _id: false // disable `_id` field for `Provider` schema
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
    role: { type: String, default: 'user' }
  }

  const UserSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(UserSchemaObject, extendedSchema)
    ), {
      timestamps: true
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

  UserTC.addFields({
    isLinkedWithFacebook: {
      type: 'Boolean!',
      resolve: (source) => {
        if (source.facebook && !source.facebook.isUnlink) {
          return true
        }
        return false
      },
      projection: { facebook: true }
    }
  })

  const Provider = mongoose.model('Provider', ProviderSchema)

  return { User, UserTC, Provider, model: User, typeComposer: UserTC }
}
