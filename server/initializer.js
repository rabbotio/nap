module.exports = async (config, nextjs) => {
  // Express
  const express = require('express')

  // Create a new Express application.
  const app = express()

  // NAP as First class
  app.use(require('./initNAP'))

  // Static
  app.use(express.static('public'))

  config.mubsub_enabled && require('./initMubsub')()

  // Mongoose
  const mongoose = await require('./initMongoose')(config.mongo_url)

  // Passport
  !config.passport_disabled && require('./initPassport')(config, app)

  // GraphQL
  !config.graphql_disabled && require('./initGraphQL')(config, app)

  // Store
  require('./initStore')(mongoose)

  // Express
  await require('./initExpress')(config, app, nextjs)

  // Ready
  debug.info('NAP is ready to use, enjoy! [^._.^]ﾉ彡')
}