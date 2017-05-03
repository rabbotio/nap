const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const { buildMongooseSchema } = require('./helpers')

module.exports = (extendedSchema) => {
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
  }

  const InstallationSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(InstallationSchemaObject, extendedSchema)
    ), {
      timestamps: true,
    }
  )

  const Installation = mongoose.model('Installation', InstallationSchema)
  const InstallationTC = composeWithMongoose(Installation)

  const willInstall = (device) => new Promise((resolve, reject) => {
    Installation.create(device, (err, result) => err ? reject(err) : resolve(result))
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
      (err, result) => err ? reject(err) : resolve(result)
    )
  })

  return { Installation, InstallationTC, InstallationSchema, willInstall, willUpdateField }
}