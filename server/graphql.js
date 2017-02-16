const cors = require('cors')

const init = app => {
  // Custom config
  // const graphiql = process.env.GRAPHIQL_ENABLED === '1' || process.env.NODE_ENV !== 'production'

  // Cross Origin
  app.use(cors())

  // Mongoose
  const graphqlHTTP = require('express-graphql')
  const { mainPage, addToMainPage } = require('./mainPage')
  const { getExampleNames, resolveExamplePath } = require('./composer')
  require('./mongooseConnection')

  const addExample = (example, uri) => {
    example.uri = `/${uri}`
    app.use(example.uri, graphqlHTTP(() => ({
      schema: example.schema,
      graphiql: true,
      formatError: (error) => ({
        message: error.message,
        stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
      }),
    })))

    addToMainPage(example)
  }

  // scan `examples` directory and add
  // - graphql endpoint by uri /exampleDirName
  // - links and example queries to index page
  const exampleNames = getExampleNames()
  for (let name of exampleNames) {
    addExample(
      require(resolveExamplePath(name)).default,
      name
    )
  }

  app.get('/', (req, res) => {
    res.send(mainPage())
  })
}

module.exports = init
