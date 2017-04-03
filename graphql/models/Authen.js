module.exports = () => {
  const mongoose = require('mongoose')
  const { composeWithMongoose } = require('graphql-compose-mongoose')

  const AuthenSchemaObject = {
    installationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isLoggedIn: { type: Boolean, default: false },
    loggedInAt: Date,
    loggedInWith: String,
    loggedOutAt: Date,
    sessionToken: String,
    accessToken: String,
  }

  const AuthenSchema = new mongoose.Schema(
    Object.assign(
      AuthenSchemaObject
    ), {
      timestamps: true,
    }
  )

  const Authen = mongoose.model('Authen', AuthenSchema)
  const AuthenTC = composeWithMongoose(Authen)

  return { Authen, AuthenTC };
}