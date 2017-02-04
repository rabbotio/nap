const getSchema = (schemaURI, noCache) => {
  // Use no cache while development.
  noCache && delete require.cache[require.resolve(schemaURI)];

  // Serve
  return require(schemaURI)
}

const init = (app) => {
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
  const GRAPHQL_SCHEMA = process.env.GRAPHQL_SCHEMA || './schema.js'
  const GRAPHQL_PRETTY = (process.env.GRAPHQL_PRETTY === '1') || IS_DEVELOPMENT
  const GRAPHIQL_ENABLED = (process.env.GRAPHIQL_ENABLED === '1') || IS_DEVELOPMENT
  const GRAPHQL_NOCACHE_SCHEMA = (process.env.GRAPHQL_NOCACHE_SCHEMA === '1') || IS_DEVELOPMENT

  console.log('Starting GraphQL...');
  console.log(`IS_DEVELOPMENT:${IS_DEVELOPMENT}`);
  console.log(`GRAPHQL_SCHEMA:${GRAPHQL_SCHEMA}`);
  console.log(`GRAPHQL_PRETTY:${GRAPHQL_PRETTY}`);
  console.log(`GRAPHIQL_ENABLED:${GRAPHIQL_ENABLED}`);
  console.log(`GRAPHQL_NOCACHE_SCHEMA:${GRAPHQL_NOCACHE_SCHEMA}`);

  const graphQLHTTP = require('express-graphql');
  const bodyParser = require('body-parser');

  app.use('/graphql',
    bodyParser.json(),
    graphQLHTTP((req, res) => ({
      graphiql: GRAPHIQL_ENABLED,
      pretty: GRAPHQL_PRETTY,
      schema: getSchema(GRAPHQL_SCHEMA, GRAPHQL_NOCACHE_SCHEMA)
    }))
  )
}

module.exports = init