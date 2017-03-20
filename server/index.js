require('./debug')
require('./config')

const init = () => {

  // Config
  const config = global.NAP.Config

  // Next
  const nextjs = require('next')({ dev: config.dev })

  nextjs.prepare().then(() => {
    const express = require('express')

    // Create a new Express application.
    const app = express()

    // NAP as First class
    app.use(require('./initNAP'))

    // Static
    app.use(express.static('public'))

    // Store
    const mongooseInitializer = require('./initMongoose')
    mongooseInitializer(config.mongo_url).then(() => {
      // Passport
      process.env.PASSPORT_DISABLED !== '1' && require('./initPassport')(config, app, nextjs)

      // Add CSRF to all POST requests
      // (If you want to add exceptions to paths you can do that here)
      const csrf = require('lusca').csrf()
      app.use('/auth/*', (req, res, next) => csrf(req, res, next))

      // GraphQL
      try {
        process.env.GRAPHQL_SERVER_DISABLED !== '1' && require('./initGraphQL')(config, app)
      } catch(err) {
        debug.warn('GraphQL error :', err)
      }

      // Global
      try {
        const mongoose = require('mongoose')
        NAP.Installation = mongoose.model('Installation')
        NAP.User = mongoose.model('User')
        NAP.Authen = mongoose.model('Authen')
        NAP.Provider = mongoose.model('Provider')
      } catch(err) {
        debug.warn('Mongoose error :', err)
      }

      // Express
      require('./initExpress')(config, app, nextjs)
    })
  })
}

module.exports = init
