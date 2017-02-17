const init = (mongoUri) => {
  const mongoose = require('mongoose')

  mongoose.Promise = global.Promise;

  mongoose.connect(mongoUri, {
    server: {
      auto_reconnect: true,
      reconnectTries: Number.MAX_VLUE,
      reconnectInterval: 1000,
    }
  })

  const connection = mongoose.connection
  connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      debug.log(e)
      mongoose.createConnection(mongoUri)
    }
    debug.log(e)
  })
  connection.once('open', () => {
    debug.log(`MongoDB successfully connected to ${mongoUri}`)
  })
}

module.exports = init
