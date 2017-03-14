const { willAuthen, willLoginWithFacebook } = require('./authen')
const NAPSession = require('../lib/NAPSession')

const init = (req, res, next) => {
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook
  }

  // No errors
  req.nap.errors = []

  // To keep compatible both client/server
  NAPSession.nap = req.nap

  next()
}

module.exports = init