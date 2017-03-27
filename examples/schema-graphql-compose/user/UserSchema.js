const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const UserSchema = new mongoose.Schema({
  username: String, // standard types
  email: String,
  role: {
    type: String,
    default: 'user'
  },
  installations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installation'
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
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

const User = mongoose.model('User', UserSchema)
const UserTC = composeWithMongoose(User)

module.exports = { User, UserTC }
