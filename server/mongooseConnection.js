const mongoose = require('mongoose')
const { mongoUri } = require('../graphql')

mongoose.Promise = Promise
mongoose.connect(mongoUri, {
  server: {
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }
})

const connection = mongoose.connection
connection.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    debug.log(e)
    mongoose.connect(mongoUri)
  }
  debug.log(e)
})
connection.once('open', () => {
  debug.log(`MongoDB successfully connected to ${mongoUri}`)
})

module.exports = { connection }