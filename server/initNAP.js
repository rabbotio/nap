const {
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword,
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
  req.nap = req.nap || _NAP

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init
