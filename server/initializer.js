module.exports = async (config, nextjs) => {
  // NAP
  const nap = require('./initNAP')

  // Express
  const app = require('./initExpress')(config, nap)

  // MubSub  
  config.mubsub_enabled && require('./initMubsub')()

  // Mongoose
  const mongoose = await require('./initMongoose')(config.mongo_url)

  // Passport
  !config.passport_disabled && require('./initPassport')(config, app)

  // GraphQL
  !config.graphql_disabled && require('./initGraphQL')(config, app)

  // Store
  require('./initStore')(mongoose)

  // Next+Express
  await require('./initRoute')(config, app, nextjs)

  // Ready
  debug.info('NAP is ready to use, enjoy! [^._.^]ﾉ彡')
}