const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const InstallationSchema = new mongoose.Schema({
  // Devices
  deviceInfo: String,
  locale: String,
  timezone: String,
  deviceName: String,

  // App
  appVersion: String,

  // User
  sessionToken: String,

  // Notifications
  GCMSenderId: String,
  deviceToken: String,
  badge: String,
  channels: String,
},
{
  timestamps: true,
})

// - - - - - - Plugins - - - - - -

const Installation = mongoose.model('Installation', InstallationSchema)
const InstallationTC = composeWithMongoose(Installation)

// - - - - - - Extras - - - - - -
InstallationTC.setResolver('createOne', InstallationTC.getResolver('createOne')
  .wrapResolve((next) => (resolveParams) => {
    // CAPTURING PHASE
    const jwt = require('jsonwebtoken')
    const sessionToken = jwt.sign({
      deviceInfo: resolveParams.args.record.deviceInfo,
      createdAt: +new Date
    }, NAP.Config.jwt_secret)

    resolveParams.args.record.sessionToken = sessionToken

    // BUBBLING PHASE
    return next(resolveParams)
  })
)

module.exports = { Installation, InstallationTC }