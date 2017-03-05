const init = ({ port }, app) => {
  // Custom config
  const graphiql = process.env.GRAPHIQL_ENABLED === '1' || process.env.NODE_ENV !== 'production'

  // Cross Origin
  const cors = require('cors')
  app.use(cors())

  // GraphQL
  const graphqlHTTP = require('express-graphql')

  const fs = require('fs')
  const path = require('path')

  const graphql_uri = `./graphql`
  const graphql_paths = (() => {
    try {
      return fs.readdirSync(graphql_uri).filter(file => fs.statSync(path.join(graphql_uri, file)).isDirectory())
    } catch (err) {
      return []
    }
  })()

  // JWT Token
  const authenticate = (req, res, next) => {
    // New commer
    if(!req.token) {
      next()
      return
    }

    const jwt = require('jsonwebtoken')
    jwt.verify(req.token, NAP.Config.jwt_secret, (err, decoded) => {
      // err
      if (err) {
        res.status(403).send('Forbidden')
        return
      }

      // decoded undefined
      if (decoded) {
        debug.info('decoded:', decoded)
        next()
        return
      }
    })
  }

  // Endpoint
  const createEndpoint = (route_path, require_path) => {
    const schema = require(require_path)
    app.use(route_path, authenticate, graphqlHTTP(() => ({
      schema,
      graphiql,
      formatError: (error) => ({
        message: error.message,
        stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
      })
    })))

    debug.info(`GraphQL : http://localhost:${port}${route_path} -> ${route_path}`)
  }

  // Multiple endpoint
  graphql_paths.forEach(tc => {
    const route_path = path.resolve('/', graphql_uri, tc)
    const require_path = path.resolve('./', graphql_uri, tc)
    createEndpoint(route_path, require_path)
  })

  // Default endpoint
  const route_path = path.resolve('/', graphql_uri)
  const require_path = path.resolve('./', graphql_uri)
  createEndpoint(route_path, require_path)
}

module.exports = init
