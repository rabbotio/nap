const init = () => {
  // Next
  const nextjs = require('next')({
    IS_DEVELOPMENT: (process.env.NODE_ENV === 'development')
  })

  nextjs.prepare().then(() => {
    // Create a new Express application.
    const app = require('express')()

    // Passport
    process.env.PASSPORT_DISABLED !== '1' && require('./passport')(app)

    // Apollo
    process.env.GRAPHQL_SERVER_DISABLED !== '1' && require('./graphql')(app)

    // Express
    require('./express')(app, nextjs)
  })
}

module.exports = init
