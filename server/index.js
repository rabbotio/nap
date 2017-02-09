const index = () => {
  // Next
  const next = require('next')({
    IS_DEVELOPMENT: (process.env.NODE_ENV === 'development')
  })

  next.prepare().then(() => {
    // Create a new Express application.
    const app = require('express')()

    // Passport
    process.env.PASSPORT_DISABLED !== '1' && require('../passport')(app)

    // Apollo
    process.env.GRAPHQL_SERVER_DISABLED !== '1' && require('../graphql')(app)

    // Next
    require('./routes')(app, next)
  })
}

module.exports = index
