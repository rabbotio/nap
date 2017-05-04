const {
  willAuthen,
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword
} = require('./authen')
const { willCreateUser } = require('./graphql/resolvers/UserResolver')
const { willInstall } = require('./graphql/resolvers/InstallationResolver')

const init = (req, res, next) => {
  // Inject req
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook,
    willSignUp,
    willLogin,
    willLogout,
    willResetPassword,
    willCreateUser,
    willInstall
  }

  // No errors
  req.nap.errors = []

  next()
}

module.exports = init
