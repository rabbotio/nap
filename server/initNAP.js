const { willAuthen, willLoginWithFacebook, willSignup , willLogin } = require('./authen')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook,
    willSignup,
    willLogin,
  }

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init