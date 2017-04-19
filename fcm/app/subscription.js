// - - - - Config - - - -
//TODO
const DEBUG = false

// - - - - Mongoose - - - -
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId;

let isMongoConected = false;
mongoose.connect('mongodb://128.199.136.111/graphql'); //TODO
const db = mongoose.connection;
db.on('error', (err) => {
  isMongoConected = false;
  console.log('mongoose connection err', err);
});
db.once('open', () => {
  // we're connected!
  isMongoConected = true;
});

// - - - - Schema - - - - 
const AuthenSchemaObject = Schema({
  installationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installation'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  loggedInAt: Date,
  loggedInWith: String,
  loggedOutAt: Date,
  sessionToken: String,
  accessToken: String,
})

const InstallationSchemaObject = Schema({
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
});

const Installation = mongoose.model('Installation', InstallationSchemaObject);
const Authens = mongoose.model('Authens', AuthenSchemaObject);


// - - - - Common - - - - 

/**
 * Will find device tokens from authen -> installation
 * @param {string} UID 
 * @return {array<string>} deviceTokenList
 */
const findDeviceTokenByUID = (UID) => {
  return new Promise((resolve, reject) => {
    Authens.find({
        userId: new ObjectId(UID),
        isLoggedIn: true
      }).populate('installationId', 'deviceToken').select('installationId')
      .exec((error, authenList) => {
        console.log('error', error);

        let deviceList = []
        authenList.forEach(function (authen) {
          this.push(authen.installationId.deviceToken)
        }, deviceList);

        DEBUG && console.log(deviceList)
        resolve(deviceList);
      })
  });
}

// - - - - User Device Installation Operation - - - - 
/**
 * 
 * @method sub
 * @method subList,
 * @method subDeviceList,
 * @method unSub,
 * @method unSubList,
 * @method unSubDeviceList,
 * @method pubTopic,
 * @method pubDevice,
 * @method getSubList,
 * @method isSub
 */
const installation = require('./installation');
//"58e76f466c08d52daa0e079a"
const sub = async(topicString, UID) => {
  const deviceList = await findDeviceTokenByUID(UID);

}

const unsub = (topicString, UID) => {

}

const pubTopic = (topicString, UID) => {

}

const pubUID = (UID, message, data) => {

}

const getSubList = (UID) => {

}

const isSub = (topicString, UID) => {

}