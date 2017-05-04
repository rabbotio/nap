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
    channels: String
  }

  const InstallationSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(InstallationSchemaObject, extendedSchema)
    ), {
      timestamps: true
    }
  )

  const Installation = mongoose.model('Installation', InstallationSchema)
  const InstallationTC = composeWithMongoose(Installation)

  return { Installation, InstallationTC, InstallationSchema }
}
