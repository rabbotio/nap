const express = require('express')
const next = require('next')

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const _next = next({ IS_DEVELOPMENT })
const handle = _next.getRequestHandler()

const HTTP_PORT = process.env.HTTP_PORT || 3000

_next.prepare()
  .then(() => {
    const app = express()

    // GraphQL
    const GRAPHQL_SUPPORT = process.env.GRAPHQL_SUPPORT === '1'
    GRAPHQL_SUPPORT && require('./graphql/init')(app)

    // Static
    app.get('/a', (req, res) => {
      return _next.render(req, res, '/b', req.query)
    })

    app.get('/b', (req, res) => {
      return _next.render(req, res, '/a', req.query)
    })

    app.get('*', (req, res) => {
      return handle(req, res)
    })

    app.listen(HTTP_PORT, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })