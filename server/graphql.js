const init = app => {
  // Custom config
  const graphiql = process.env.GRAPHIQL_ENABLED === "1" || process.env.NODE_ENV !== "production"

  // Middleware
  const schema = require('./schema')
  const graffiti = require('@risingstack/graffiti')

  // Apply
  app.use(graffiti.express({ schema, graphiql }))
}

module.exports = init
