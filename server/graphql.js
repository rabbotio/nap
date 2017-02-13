const init = app => {
  // Custom config
  const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
  const GRAPHIQL_ENABLED = process.env.GRAPHIQL_ENABLED === "1" || IS_DEVELOPMENT

  // No joy
  if(!GRAPHIQL_ENABLED) return;

  // Middleware
  const schema = require('./schema')
  const graffiti = require('@risingstack/graffiti')

  // Apply
  app.use(graffiti.express({ schema }))
}

module.exports = init
