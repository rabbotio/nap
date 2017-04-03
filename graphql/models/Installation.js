const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const { buildMongooseSchema } = require('./helpers');

module.exports = (config) => {
  const InstallationSchemaObject = {
    deviceInfo: String,
    locale: String,
    country: String,
    timezone: String,
    deviceName: String,

    // App
    bundleId: String,
    appVersion: String,

    // Notifications
    GCMSenderId: String,
    deviceToken: String,
    badge: String,
    channels: String,
  };

  const InstallationSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(InstallationSchemaObject, config)
    ), {
      timestamps: true,
    }
  )

  const Installation = mongoose.model('Installation', InstallationSchema)
  const InstallationTC = composeWithMongoose(Installation)

  const willInstall = (device) => new Promise((resolve, reject) => {
    Installation.create(device, (err, result) => {
      // Error?
      err && debug.error(err) && reject(err)
      // Succeed
      resolve(result)
    })
  })

  const willUpdateField = (installationId, fieldObject) => new Promise((resolve, reject) => {
    Installation.findOneAndUpdate(
      // Find
      { installationId },
      // Update
      fieldObject,
      // Options
      { new: true, upsert: false },
      // Callback
      (err, result) => {
        // Error?
        err && debug.error(err) && reject(err)
        // Succeed
        resolve(result)
      })
  })

  return { Installation, InstallationTC, InstallationSchema, willInstall, willUpdateField };
};