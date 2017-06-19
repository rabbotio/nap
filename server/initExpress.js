const init = ({ port }, nap) => {
  // Create a new Express application.
  const express = require('express')
  const app = express()

  // NAP as First class
  app.use(nap)

  // Static
  app.use(express.static('public'))

  return app
}

module.exports = init
