const {
  willLoginWithFacebook
} = require('./authen-facebook')

const {
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword
} = require('./authen-local')

const {
  willInstallAndAuthen
} = require('./graphql/resolvers')

const { willCreateUser } = require('./graphql/resolvers/UserResolver')

const _NAP = {
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword,
  willInstallAndAuthen,
  willCreateUser
}

const init = (req, res, next) => {
  // Inject req
  req.nap = _NAP

  // No session
  req.nap.session = null

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init
