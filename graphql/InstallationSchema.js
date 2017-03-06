const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const InstallationSchema = new mongoose.Schema(
  {
    // Devices
    deviceInfo: String,
    locale: String,
    country: String,
    timezone: String,
    deviceName: String,
    isEmulater: Boolean,
    isTablet: Boolean,

    // App
    bundleId: String,
    appVersion: String,

    // Token
    sessionToken: String,
    userToken: String,

    // Notifications
    GCMSenderId: String,
    deviceToken: String,
    badge: String,
    channels: String,
  },
  {
    timestamps: true,
  }
)

// - - - - - - Plugins - - - - - -

const Installation = mongoose.model('Installation', InstallationSchema)
const InstallationTC = composeWithMongoose(Installation)

// - - - - - - Extras - - - - - -
InstallationTC.setResolver('createOne', InstallationTC.getResolver('createOne')
  .wrapResolve((next) => (resolveParams) => {
    // CAPTURING PHASE
    const jwt = require('jsonwebtoken')
    const sessionToken = jwt.sign(
      Object.assign(resolveParams.args.record, { createdAt: new Date().toISOString() }),
      NAP.Config.jwt_secret
    )

    resolveParams.args.record.sessionToken = sessionToken

    // BUBBLING PHASE
    return next(resolveParams).then(payload => {
      debug.log('payload:', payload)
      return payload
    })
  })
)

module.exports = { Installation, InstallationTC }