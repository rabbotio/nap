const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const SocialSchema = new mongoose.Schema(
  {
    id: String,
    token: String,
    expire: Date,
    provider: {
      type: String,
      enum: ['facebook', 'twitter', 'google', 'github'],
    }
  },
  {
    _id: false, // disable `_id` field for `Social` schema
  }
)

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  token: String,
  verified: { type: 'boolean', default: false },
  phones: String,
  socials: [SocialSchema],
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
UserSchema.plugin(timestamps);

const User = mongoose.model('User', UserSchema)
const UserTC = composeWithMongoose(User)

debug.log('UserSchema')

module.exports = { User, UserTC }
