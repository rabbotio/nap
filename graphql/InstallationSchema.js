const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

// - - - - - - Extra fields - - - - - -

let _extraInstallationSchema = {}
try {
  const { extraInstallationSchema } = require('./custom')
  _extraInstallationSchema = extraInstallationSchema
} catch (err) { err }

// - - - - - - Default fields - - - - - -

const InstallationSchemaObject = {
  // Devices
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

const fields = ['GCMSenderId', 'deviceToken']
fields.map(field => InstallationTC.addResolver({
  name: `update_${field}`,
  kind: 'mutation',
  args: {
    [field]: 'String',
  },
  type: InstallationTC,
  resolve: ({ context, args }) => new Promise(async (resolve, reject) => {
    // Guard
    if (!context.nap.currentUser) {
      return reject(new Error('No session found'))
    }

    // Update
    const installation = await willUpdateField(context.nap.currentUser.installationId, { [field]: args[field] })

    // Fail
    if (!installation) {
      return reject(new Error('No installation found'))
    }

    // Succeed
    return resolve(installation)
  })
}))

// - - - - - - Exports - - - - - -

module.exports = { Installation, InstallationTC, InstallationSchema, willInstall }