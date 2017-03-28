const { willAuthen, willLoginWithFacebook, willLoginWithEmail } = require('./authen')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook,
    willLoginWithEmail,
  }

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init