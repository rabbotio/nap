// - - - - CONFIG - - -  -
const DEBUG = true
const logger = require('./util/logger')
logger.info('Initialize')

// - - - - mubsub - - -  -
const mubsub = require('mubsub');
/**
 * Connect to mongo MubSub, this will trigger pub and sub for each user
 * @param {string} host 255.255.255.255 or Domain
 * @param {string} channelName
 */
const connectMubSub = (host, channelName) => new Promise((resolve, reject) => {
   const client = mubsub(`mongodb://${host}/fcm-notification`);
   const channel = client.channel(channelName);

   client.on('error', onError)
   channel.on('error', onError)

   const Id = Date.now();

   mapSub(channel, 'service.ready', (data) => {
      if (data.Id == Id) {
         DEBUG && console.log(`service.ready id: ${data.Id} channel: ${channelName}`);

         resolve()
         logger.info('service.ready')
      }
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
   const func = customFunc ? customFunc : operation[split[0]][split[1]];
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

const operation = {
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

      },
      kill: (data) => {

      },
      revive: (data) => {

      }
   }
}
const onError = (err) => {
   console.error(err)
   logger.error(err)

   //check for type?
   process.exit(1);
}

module.exports = {
   connectMubSub
}