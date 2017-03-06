const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const AuthenSchema = new mongoose.Schema(
  {
    installations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation'
    }],
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    loggedInAt: Date,
    loggedInWith: String,
    loggedOutAt: Date,
  },
  {
    timestamps: true,
  }
)

// - - - - - - Plugins - - - - - -

const Authen = mongoose.model('Authen', AuthenSchema)
const AuthenTC = composeWithMongoose(Authen)

// - - - - - - Extras - - - - - -

AuthenTC.setResolver('updateOne', AuthenTC.getResolver('updateOne')
  .wrapResolve((next) => (resolveParams) => {
    // CAPTURING PHASE

    // TODO : Link fb accessToken with sessionToken

    // BUBBLING PHASE
    return next(resolveParams)
  })
)

// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }