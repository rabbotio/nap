// - - - - CONFIG - - -  -
const DEBUG = true

// - - - - mubsub - - -  -
const mubsub = require('mubsub');
let client = null;
/**
 * Connect to mongo MubSub, this will trigger pub and sub for each user
 * @param {string} host 255.255.255.255 or Domain
 */
const connectMubSub = (host) => new Promise((resolve, reject) => {
   const client = mubsub(`mongodb://${host}/fcm-notification`);
   const channel = client.channel('dev');

   client.on('error', console.error)
   channel.on('error', console.error)
   const Id = Math.random();

   mapSub(channel, 'service.ready', (data) => {
      DEBUG && console.log('service.ready', data.Id);
      resolve(data.Id == Id)
   })

   //self test init
   channel.publish('service.ready', {
      Id
   })

   // - - - - FCM - - - -

   /**
    * @param {string} topic
    * @param {string} title
    * @param {string} body
    * @param {object} data
    */
   mapSub(channel, 'publish.topic', null)

   /**
    * @param {string} UID
    * @param {string} title
    * @param {string} body
    * @param {object} data
    */
   mapSub(channel, 'publish.UID', null)
   mapSub(channel, 'authen.login', null)
   mapSub(channel, 'authen.logout', null)

})

const mapSub = (channel, action, customFunc) => {
   const split = action.split('.')
   const func = customFunc ? customFunc : instance[split[0]][split[1]];
   channel.subscribe(action, func)
}

// - - - - Subscirption - - 
const {
   sub,
   unSub,
   pubTopic,
   pubUID,
   connectMongoose,
   findDeviceTokenByUID
} = require('./subscription')

const instance = {
   publish: {
      UID: (data) => {
         DEBUG && console.log('publish.UID', data)
         pubUID(data)
      },
      topic: (data) => {
         DEBUG && console.log('publish.topic', data)
         pubTopic(data)
      }
   },
   authen: {
      login: (data) => {
         DEBUG && console.log('authen.login', data);
         //TODO sync subscription to new deviceToken
      },
      logout: (data) => {
         DEBUG && console.log('authen.logout', data);
         //TODO sync subscription to new deviceToken
      },
   },
   service: {
      ready: (data) => {

      }
   }
}

module.exports = {
   connectMubSub
}