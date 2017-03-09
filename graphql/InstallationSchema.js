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
  debug.log(' * install :', device)

  Installation.create(device, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { Installation, InstallationTC, InstallationSchema, willInstall }