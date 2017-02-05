const getSchema = (schemaURI, noCache) => {
  // Use no cache while development.
  noCache && delete require.cache[require.resolve(schemaURI)]

  // Serve
  return require(schemaURI)
}

const init = app => {
  // GraphQL's schema URI
  const GRAPHQL_SCHEMA = process.env.GRAPHQL_SCHEMA || "./schema.js"

  // Custom config
  const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
  const GRAPHQL_PRETTY = process.env.GRAPHQL_PRETTY === "1" || IS_DEVELOPMENT
  const GRAPHIQL_ENABLED = process.env.GRAPHIQL_ENABLED === "1" || IS_DEVELOPMENT
  const GRAPHQL_SCHEMA_NOCACHE = process.env.GRAPHQL_SCHEMA_NOCACHE === "1" || IS_DEVELOPMENT

  // Middleware
  const schema = require('./schema')
  const graffiti = require('@risingstack/graffiti')
  const { json } = require("body-parser")

  // Apply
  app.use(json())
  app.use(graffiti.express({ schema }))
}

module.exports = init
