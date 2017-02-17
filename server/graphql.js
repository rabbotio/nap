const cors = require('cors')

const init = app => {
  // Custom config
  const graphiql = process.env.GRAPHIQL_ENABLED === '1' || process.env.NODE_ENV !== 'production'

  // Cross Origin
  app.use(cors())

  // Mongoose
  const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo/graphql'
  require('./mongoose')(mongoUri)

  // GraphQL
  const graphqlHTTP = require('express-graphql')
  const schema = require('../graphql/clogii')

  app.use('/graphql', graphqlHTTP(() => ({
    schema,
    graphiql,
    formatError: (error) => ({
      message: error.message,
      stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
    }),
  })))
}

module.exports = init
