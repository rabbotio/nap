const init = (mongo_url) => {
  return new Promise((resolve, reject) => {
    const mongoose = require('mongoose')

    mongoose.Promise = global.Promise;

    mongoose.connect(mongo_url, {
      server: {
        auto_reconnect: true,
        reconnectTries: Number.MAX_VLUE,
        reconnectInterval: 1000,
      }
    })

    const connection = mongoose.connection
    connection.on('error', (err) => {
      /* TODO : Handle error
      if (e.message.code === 'ETIMEDOUT') {
        debug.log(e)
        mongoose.createConnection(mongo_url)
      }
      debug.log(e)
      */

      reject(err)
    })
    
    connection.once('open', () => {
      debug.log(`MongoDB : ${mongo_url}`)
      resolve(mongoose)
    })
  })
}

module.exports = init
