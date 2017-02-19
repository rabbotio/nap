require('./debug')

const init = () => {
  // Config
  const config = require('./config')

  // Next
  const nextjs = require('next')({
    IS_DEVELOPMENT: (process.env.NODE_ENV === 'development')
  })

  nextjs.prepare().then(() => {
    const express = require('express')

    // Create a new Express application.
    const app = express()

    // Static
    app.use(express.static('public'))

    // Passport
    process.env.PASSPORT_DISABLED !== '1' && require('./passport')(app, config)

    // Users
    require('./users')(app)
    
    // GraphQL
    process.env.GRAPHQL_SERVER_DISABLED !== '1' && require('./graphql')(app, config)

    // Express
    require('./express')(app, config, nextjs)
  })
}

module.exports = init
