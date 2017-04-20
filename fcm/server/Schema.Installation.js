const mongoose = require('mongoose')
//   Schema = mongoose.Schema;

// const InstallationSchemaObject = Schema({
//    deviceInfo: String,
//    locale: String,
//    country: String,
//    timezone: String,
//    deviceName: String,

//    // App
//    bundleId: String,
//    appVersion: String,

//    // Notifications
//    GCMSenderId: String,
//    deviceToken: String,
//    badge: String,
//    channels: String,
// });

// const Installation = mongoose.model('Installation', InstallationSchemaObject);

// module.exports = {
//    InstallationSchemaObject,
//    Installation
// }



const genModel = (config) => {
  return mongoose.model('Installation', genSchema(config))
}

const genSchema = (config) => {
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
  };

  const {
    buildMongooseSchema
  } = require('./helpers');

  const InstallationSchema = new mongoose.Schema(
    Object.assign(
      buildMongooseSchema(InstallationSchemaObject, config)
    ), {
      timestamps: true,
    })

  return InstallationSchema;
}


module.exports = (config) => {

  const {
    composeWithMongoose
  } = require('graphql-compose-mongoose')

  const InstallationSchema = genSchema(config)
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
      {
        installationId
      },
      // Update
      fieldObject,
      // Options
      {
        new: true,
        upsert: false
      },
      // Callback
      (err, result) => {
        // Error?
        err && debug.error(err) && reject(err)
        // Succeed
        resolve(result)
      })
  })

  return {
    Installation,
    InstallationTC,
    InstallationSchema,
    willInstall,
    willUpdateField
  };
};

module.exports.genSchema = genSchema;
module.exports.genModel = genModel;