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

  // Valid acccessToken?
  const loginWithFacebook = req => new Promise((resolve, reject) => {
    // Validate facebook token
    const passport = require('passport')
    passport.authenticate('facebook-token', (error, user) => {
      if (user) {
        debug.log('user:', user)
        resolve(user)
      } else {
        debug.warn('No facebook access_token provide')
        reject(null)
      }
    })(req)
  })

  // JWT Token
  const authenticate = (req, res, next) => {
    // Inject passport validator
    req.loginWithFacebook = accessToken => (req.body.access_token = accessToken) && loginWithFacebook(req)
    next()
    return

    // req.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiaW5zZXJ0aW5nIjp0cnVlLCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiY3JlYXRlZEF0IjoibW9kaWZ5In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6e30sIm1vZGlmeSI6eyJjcmVhdGVkQXQiOnRydWV9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX2lkIjoiNThiZWIwZDFmODZmYjEwMzU2NWExNjQ3IiwiYXBwVmVyc2lvbiI6IjEuMC4xIiwiYnVuZGxlSWQiOiJpby5yYWJib3QubmFwIiwiaXNUYWJsZXQiOmZhbHNlLCJpc0VtdWxhdGVyIjp0cnVlLCJkZXZpY2VOYW1lIjoi4oCLRGlnaXRodW7igJlzIGlNYWMiLCJ0aW1lem9uZSI6IkFzaWEvQmFuZ2tvayIsImNvdW50cnkiOiJVUyIsImxvY2FsZSI6ImVuIiwiZGV2aWNlSW5mbyI6IkFwcGxlIFNpbXVsYXRvciBpT1MiLCJjcmVhdGVkQXQiOiIyMDE3LTAzLTA3VDEzOjA4OjMzLjcyOFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTAzLTA3VDEzOjA4OjMzLjY5N1oiLCJfX3YiOjB9LCJpbnN0YWxsdGlvbklkIjoiNThiZWIwZDFmODZmYjEwMzU2NWExNjQ3IiwiaWF0IjoxNDg4ODkyMTEzfQ.PE2UbzH3OR1EqiroJVkWackMAIHp4icueL6dZlva4Uk"
    // TODO : white list only for mutation `init`
    // New commer
    if (!req.token) {
      next()
      return
    }

    // Valid sessionToken?
    const jwt = require('jsonwebtoken')
    jwt.verify(req.token, NAP.Config.jwt_secret, (err, decoded) => {
      // err
      if (err) {
        res.status(403).send('Forbidden')
        return
      }

      // decoded undefined
      if (decoded) {
        debug.info('decoded:', decoded._doc._id)

        // Hack acccessToken from GraphQL query
        // This is not ideal, will find some other way.
        // req.body.access_token = "EAABnTrZBSJyYBAKvcWAcAOUwt07ZCVxhCYQwKKWFZAwtOhsGYZAc7olL04W8eJTlxBeZCmxCQO9kYZA4kKtTD0zmZChhb5hEoZBl7JHT0Rx39uGP8ow2X9vGoTLFZCm4Dd0NFvH0qsHXNYinsOKjszfSJVOj3DZChv0MNszawr1le8O0ToqI3Ak9Jr8X3X6imEtvJ2q8ceeVh5Ux1rSbgypRQNRDjlredVXpIZD" //req.query.record.access_token

        loginWithFacebook(req, res, next).then(user => {
          if (user) {
            // For later use inside GraphQL
            req.authen = {
              installationId: decoded.installationId,
              userId: user._id,
              loggedInAt: new Date().toISOString(),
              loggedInWith: 'facebook' // TODO : const FACEBOOK
            }
            next()
            return
          }
        })
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
