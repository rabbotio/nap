const express = require('express')
const next = require('next')

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const app = next({ IS_DEVELOPMENT })
const handle = app.getRequestHandler()

const HTTP_PORT = process.env.HTTP_PORT || 3000

app.prepare()
  .then(() => {
    const server = express()

    // GraphQL
    const GRAPHQL_SUPPORT = process.env.GRAPHQL_SUPPORT === '1'
    const GRAPHQL_SCHEMA = process.env.GRAPHQL_SCHEMA || './graphql/schema.js'
    const GRAPHQL_PRETTY = (process.env.GRAPHQL_PRETTY === '1') || IS_DEVELOPMENT
    const GRAPHIQL_SUPPORT = (process.env.GRAPHIQL_SUPPORT === '1') || IS_DEVELOPMENT
    const GRAPHQL_NOCACHE_SCHEMA = (process.env.GRAPHQL_NOCACHE_SCHEMA === '1') || IS_DEVELOPMENT

    console.log('Starting GraphQL...');
    console.log(`IS_DEVELOPMENT:${IS_DEVELOPMENT}`);
    console.log(`GRAPHQL_SUPPORT:${GRAPHQL_SUPPORT}`);
    console.log(`GRAPHQL_SCHEMA:${GRAPHQL_SCHEMA}`);
    console.log(`GRAPHQL_PRETTY:${GRAPHQL_PRETTY}`);
    console.log(`GRAPHIQL_SUPPORT:${GRAPHIQL_SUPPORT}`);
    console.log(`GRAPHQL_NOCACHE_SCHEMA:${GRAPHQL_NOCACHE_SCHEMA}`);

    if (GRAPHQL_SUPPORT) {

      function getSchema() {
        if (GRAPHQL_NOCACHE_SCHEMA) {
          delete require.cache[require.resolve(GRAPHQL_SCHEMA)];
        }

        return require(GRAPHQL_SCHEMA);
      }

      const graphQLHTTP = require('express-graphql');
      server.use('/graphql', graphQLHTTP((request) => {
        return {
          graphiql: GRAPHIQL_SUPPORT,
          pretty: GRAPHQL_PRETTY,
          schema: getSchema()
        }
      }));
    }

    // Static
    server.get('/a', (req, res) => {
      return app.render(req, res, '/b', req.query)
    })

    server.get('/b', (req, res) => {
      return app.render(req, res, '/a', req.query)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(HTTP_PORT, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })