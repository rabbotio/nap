// - - - - Config - - - -
const DEBUG = false

// - - - - Mongoose - - - -
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId;

let isMongoConected = false;

/**
 * Connect to mongoose server. Required before donig anything
 * @param {string} host 255.255.255.255 or Domain
 */
const connectMongoose = (host) => new Promise((resolve, reject) => {
  mongoose.connect(`mongodb://${host}/graphql`); //TODO
  const db = mongoose.connection;
  db.on('error', (err) => {
    isMongoConected = false;
    mubsub
    DEBUG && console.log('mongoose connection err', err);
  });
  db.once('open', () => {
    // we're connected!
    isMongoConected = true;
    DEBUG && console.log('mongoose connection success');
    resolve(true);
  });
})

// - - - - Schema - - - - TODO MOVE TO DOCKER VOLUME
const Authens = require('./Schema.Authen').genModel(null)
const Installation = require('./Schema.Installation').genModel(null)

// - - - - Common - - - - 

/**
 * Will find device tokens from authen -> installation
 * @param {string} UID 
 * @return {array<string>} deviceTokenList
 */
const findDeviceTokenByUID = ({
  UID
}) => new Promise((resolve, reject) => {
  console.log('finding', UID);
  Authens.find({
      userId: new ObjectId(UID),
      isLoggedIn: true
    }).populate('installationId', 'deviceToken').select('installationId')
    .exec((error, authenList) => {
      DEBUG && console.log('error', error);
      // console.log('authenList', authenList);

      let deviceList = []
      authenList.forEach(function (authen) {
        this.push(authen.installationId.deviceToken)
      }, deviceList);

      DEBUG && console.log('deviceList', deviceList)

      resolve(deviceList);
    })
});

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

/**
 * Subscribe user devices on single topic
 * @param {string} topic 
 * @param {string} UID 
 */
const sub = async({
  topic,
  UID
}) => {
  DEBUG && console.log('subing..')
  const deviceList = await findDeviceTokenByUID({
    UID
  });

  const result = await installation.subDeviceList(topic, deviceList)
  return result
}

/**
 * Unsubscribe user devices on single topic
 * @param {string} topic 
 * @param {string} UID 
 */
const unSub = async({
  topic,
  UID
}) => {
  DEBUG && console.log('unsubing..')
  const deviceList = await findDeviceTokenByUID({
    UID
  });

  const result = await installation.unSubDeviceList(topic, deviceList)
  return result
}

/**
 * Publish to devices that subscribes to topic
 * @param {string} topic 
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
const pubTopic = async({
  topic,
  title,
  body,
  data
}) => {
  const result = await installation.pubTopic(topic, title, body, data)

  return result
}

/**
 * Publish to devices of the user
 * @param {string} UID 
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
const pubUID = async({
  UID,
  title,
  body,
  data
}) => {
  DEBUG && console.log('pub to devices..')
  const deviceList = await findDeviceTokenByUID({
    UID
  });

  let resultList = []
  for (let i = 0; i < deviceList.length; i++) {
    const result = await installation.pubDevice(deviceList[i], title, body, data)
    resultList.push(result)
  }

  return resultList
}

/**
 * TODO
 * Will mark inactive device
 * @param {string} UID 
 */
const markInactiveDevice = ({
  UID
}) => {
  return false;
}

module.exports = {
  sub,
  unSub,
  pubTopic,
  pubUID,
  connectMongoose,
  findDeviceTokenByUID
}