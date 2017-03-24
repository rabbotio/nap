const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

let _extraInstallationSchema = {}
try {
  const { extraInstallationSchema } = require('./custom')
  _extraInstallationSchema = extraInstallationSchema
} catch (err) { err }

const InstallationSchemaObject = {
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
}

const InstallationSchema = new mongoose.Schema(
  Object.assign(
    InstallationSchemaObject,
    _extraInstallationSchema
  ), {
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