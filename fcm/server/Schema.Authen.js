const mongoose = require('mongoose')
//   Schema = mongoose.Schema;

// const AuthenSchemaObject = Schema({
//   installationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Installation'
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   isLoggedIn: {
//     type: Boolean,
//     default: false
//   },
//   loggedInAt: Date,
//   loggedInWith: String,
//   loggedOutAt: Date,
//   sessionToken: String,
//   accessToken: String,
// })

// const Authens = mongoose.model('Authens', AuthenSchemaObject)

// module.exports = {
//   AuthenSchemaObject,
//   Authens
// }


const genModel = (config) => {
  return mongoose.model('Authen', genSchema(config))
}

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

  const {
    buildMongooseSchema
  } = require('./helpers');

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

  const Authen = genModel(config)
  const AuthenTC = composeWithMongoose(Authen)

  return {
    Authen,
    AuthenTC
  };
}

module.exports.genSchema = genSchema;
module.exports.genModel = genModel;