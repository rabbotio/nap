const {
  buildMongooseSchema
} = require('./helpers');

const genSchema = (config) => {
  const AuthenSchemaObject = {
    installationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    loggedInAt: Date,
    loggedInWith: String,
    loggedOutAt: Date,
    sessionToken: String,
    accessToken: String,
  }

  const AuthenSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(AuthenSchemaObject, config)
    ), {
      timestamps: true,
    }
  )

  return AuthenSchema;
}

module.exports = (config) => {
  const mongoose = require('mongoose')
  const {
    composeWithMongoose
  } = require('graphql-compose-mongoose')


  const AuthenSchema = genSchema(config);

  const Authen = mongoose.model('Authen', AuthenSchema)
  const AuthenTC = composeWithMongoose(Authen)

  return {
    Authen,
    AuthenTC
  };
}

module.exports.genSchema = genSchema;