const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const AuthenSchema = new mongoose.Schema(
  {
    id: String,
    token: String
  },
  {
    _id: false, // disable `_id` field for `Authen` schema
  }
)

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  token: String,
  verified: { type: 'boolean', default: false },
  phones: String,
  facebook: { type: AuthenSchema },
  twitter: { type: AuthenSchema },
  google: { type: AuthenSchema },
  github: { type: AuthenSchema },
  role: { type: String, default: 'user' }
})

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

// Auto timestamps
const timestamps = require('mongoose-timestamp')
UserSchema.plugin(timestamps)

const User = mongoose.model('User', UserSchema)
const UserTC = composeWithMongoose(User)

const Authen = mongoose.model('Authen', AuthenSchema)
module.exports = { User, UserTC, Authen }
