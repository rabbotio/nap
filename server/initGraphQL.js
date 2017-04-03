const init = (config, app) => {
  const cors = require('cors')
  app.use(cors())

  const graphqlHTTP = require('express-graphql')

  const { buildSchema } = require('../graphql')
  const { authenticate } = require('./authen')
  const schema = buildSchema(config);
  app.use('/graphql', authenticate, graphqlHTTP(() => ({
    schema,
    graphiql: config.graphqliqlEnabled,
    formatError: (error) => ({
      message: error.message,
      stack: !error.message.match(/[NOSTACK]/i) ? error.stack.split('\n') : null,
    }),
  })))
}

module.exports = init
