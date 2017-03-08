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
/*
InstallationTC.setResolver('createOne', InstallationTC.getResolver('createOne')
  .wrapResolve((next) => (resolveParams) => {
    // CAPTURING PHASE : resolveParams = { source, args, context, info }

    // debug.log(' * resolveParams.context :', resolveParams.context)

    // BUBBLING PHASE
    return next(resolveParams).then(payload => {
      debug.log(' * payload :', payload)

      const jwt = require('jsonwebtoken')
      const sessionToken = jwt.sign(
        Object.assign(payload.record, {
          installtionId: payload.record._id,
          createdAt: new Date().toISOString()
        }),
        NAP.Config.jwt_secret
      )

      return new Promise((resolve, reject) => {
        payload.record.sessionToken = sessionToken
        payload.record.save(err => {
          err && debug.error(err) && reject(err)
          debug.log(' ^ payload :', payload)
          resolve(payload)
        })
      })
    })
  })
)
*/

const install = (device) => new Promise((resolve, reject) => {
  debug.log(' * install :', device)

  Installation.create(device, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { Installation, InstallationTC, InstallationSchema, install }