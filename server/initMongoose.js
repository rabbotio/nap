const init = (mongo_url) => {
  return new Promise((resolve, reject) => {
    const mongoose = require('mongoose')

    mongoose.Promise = global.Promise

    mongoose.connect(mongo_url, {
      server: {
        auto_reconnect: true,
        reconnectTries: Number.MAX_VLUE,
        reconnectInterval: 1000,
      }
    })

    const connection = mongoose.connection
    connection.on('error', (err) => {
      // TODO : Handle error
      if (err.message.code === 'ETIMEDOUT') {
        debug.error(err)
        // mongoose.createConnection(mongo_url)
      }

      reject(err)
    })
    
    connection.once('open', () => {
      debug.info(`MongoDB : ${mongo_url}`)
      resolve(mongoose)
    })
  })
}

module.exports = init
