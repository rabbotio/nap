const cors = require('cors')

const init = app => {
  // Custom config
  const graphiql = process.env.GRAPHIQL_ENABLED === '1' || process.env.NODE_ENV !== 'production'

  // Cross Origin
  app.use(cors())

  // Mongoose
  const mongo_uri = process.env.MONGODB_URI
  require('./mongoose')(mongo_uri)

  // GraphQL
  const graphqlHTTP = require('express-graphql')

  const fs = require('fs')
  const path = require('path')

  const graphql_uri = `./graphql`
  const abs_graphql_uri = path.resolve(process.env.PWD, graphql_uri)
  const graphql_paths = fs.readdirSync(abs_graphql_uri).filter(file => fs.statSync(path.join(abs_graphql_uri, file)).isDirectory())

  graphql_paths.forEach(tc => {
    const graphql_path = path.resolve('/', graphql_uri, tc)
    const abs_graphql_path = `${abs_graphql_uri}/${tc}`
    const schema = require(abs_graphql_path)

    app.use(graphql_path, graphqlHTTP(() => ({
      schema,
      graphiql,
      formatError: (error) => ({
        message: error.message,
        stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
      })
    })))

    debug.log(`GraphQL : http://localhost:${process.env.HTTP_PORT}${graphql_path} -> ${abs_graphql_path}`)
  })
}

module.exports = init
