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

const willInstall = (device) => new Promise((resolve, reject) => {
  Installation.create(device, (err, result) => {
    // Error?
    err && debug.error(err) && reject(err)
    // Succeed
    resolve(result)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { Installation, InstallationTC, InstallationSchema, willInstall }