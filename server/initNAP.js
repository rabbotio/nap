const { willAuthen, willLoginWithFacebook } = require('./authen')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook
  }

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init