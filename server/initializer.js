module.exports = async (config, nextjs) => {
  // Express
  const express = require('express')

  // Create a new Express application.
  const app = express()

  // NAP as First class
  app.use(require('./initNAP'))

  // Static
  app.use(express.static('public'))

  // Mongoose
  const mongoose = await require('./initMongoose')(config.mongo_url)

  // Passport
  process.env.PASSPORT_DISABLED !== '1' && require('./initPassport')(config, app, nextjs)

  // GraphQL
  process.env.GRAPHQL_SERVER_DISABLED !== '1' && require('./initGraphQL')(config, app)

  // Store
  require('./initStore')(mongoose)

  // Authen
  require('./initAuthen')(config, app)

  // Express
  require('./initExpress')(config, app, nextjs)
}