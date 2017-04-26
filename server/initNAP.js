const {
  willAuthen,
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willResetPassword,
} = require('./authen')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook,
    willSignUp,
    willLogin,
    willResetPassword,
  }

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init