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

  // Notifications
  GCMSenderId: String,
  deviceToken: String,
  badge: String,
  channels: String,
})

// - - - - - - Plugins - - - - - -

// Auto timestamps
const timestamps = require('mongoose-timestamp')
InstallationSchema.plugin(timestamps)

const Installation = mongoose.model('Installation', InstallationSchema)
const InstallationTC = composeWithMongoose(Installation)

module.exports = { Installation, InstallationTC }