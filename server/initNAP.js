const { willAuthen, willLoginWithFacebook } = require('./authen')
const persist = require('../lib/persist')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook
  }

  // No errors
  req.nap.errors = []

  // To keep compatible both client/server
  persist.nap = req.nap

  next()
}

module.exports = init