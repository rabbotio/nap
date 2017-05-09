// Forget password
const willResetPassword = async (req, email) => {
  // Guard
  const { willValidateEmail } = require('../../passport-local')
  const isValidEmail = await willValidateEmail(email)
  if (!isValidEmail) {
    return new Error('Not valid email')
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willResetPasswordExistingUser } = require('../../passport-local')
  const user = await willResetPasswordExistingUser(email, token)

  // Guard
  if (!user) {
    return new Error(`Can't reset password for : ${email}`)
  }

  // Will send email verification
  const { createPasswordResetURL, createNewPasswordResetURL } = require('../../passport-local')
  const baseURL = `${req.protocol}://${req.headers.host}`
  const passwordResetURL = createPasswordResetURL(baseURL, token)
  const newPasswordResetURL = createNewPasswordResetURL(baseURL)

  // New user, will need verification by email
  const mailer = require('../../mailer')
  const msg = await mailer.willSendPasswordReset(email, passwordResetURL, newPasswordResetURL)

  // Got verificationURL and msg?
  return msg ? user : new Error(`Can't send email: `, passwordResetURL)
}

// Register with email and password
const willSignUp = async (req, email, password) => {
  // Guard
  const { willValidateEmailAndPassword } = require('../../passport-local')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password)
  if (!isValidEmailAndPassword) {
    return new Error('Not valid email and/or password')
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willSignUpNewUser } = require('../../passport-local')
  const user = await willSignUpNewUser(email, password, token)

  // Guard
  if (!user) {
    return new Error(`Can't sign up : ${email}`)
  }

  // Will send email verification
  const { createVerificationURL } = require('../../passport-local')
  const verificationURL = createVerificationURL(`${req.protocol}://${req.headers.host}`, token)

  // New user, will need verification by email
  const mailer = require('../../mailer')
  const msg = await mailer.willSendVerification(email, verificationURL)

  // Got verificationURL and msg?
  return msg ? user : new Error(`Can't send email: `, verificationURL)
}

const _willAuthenticateWithPassport = (strategy, req) => new Promise((resolve, reject) => {
  const passport = require('passport')
  passport.authenticate(strategy, (err, user) => {
    // Error?
    if (err) {
      return reject(err)
    }

    return user ? resolve(user) : reject(new Error('Wrong user and/or password'))
  })(req)
})

// Login with email
const willLogin = async (req, email, password) => {
  // Guard
  const { willValidateEmailAndPassword } = require('../../passport-local')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password)
  if (!isValidEmailAndPassword) {
    return new Error('Not valid email and/or password')
  }

  // To let passport-local consume
  req.body.email = email
  req.body.password = password

  // Validate local
  const user = _willAuthenticateWithPassport('local', req)
  return user ? user : new Error('Authentication failed')
}

// Valid accessToken?
const willLoginWithFacebook = async (req, accessToken) => {
  // Guard
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return new Error('Required : FACEBOOK_APP_ID, FACEBOOK_APP_SECRET')
  }

  // Guard
  const { isEmpty } = require('validator')
  if (isEmpty(accessToken)) {
    return new Error('Required : accessToken')
  }

  // To let passport-facebook-token consume
  req.body.access_token = accessToken

  // Validate facebook token
  const user = _willAuthenticateWithPassport('facebook-token', req)
  return user ? user : new Error('Authentication failed')
}

const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
  NAP.Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false
  }, { new: true, upsert: false }, (err, result) => err ? reject(err) : resolve(result))
})

const willInstallAndAuthen = async (context, args, user, provider) => {
  // Guard
  if (!user) {
    throw new Error('Authen error')
  }

  // Link
  const { willInstall } = require('./InstallationResolver')
  const { willAuthen } = require('./AuthenResolver')
  const installation = await willInstall(args)
  const authen = await willAuthen(installation.id, user, provider)

  // Failed
  if (!authen) {
    throw new Error('Authen error')
  }

  // Succeed
  return authen
}

module.exports = {
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword,
  willInstallAndAuthen
}
