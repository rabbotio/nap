const { onError } = require('./errors')

// Forget password
const willResetPassword = async (req, email) => {
  // Guard
  const { willValidateEmail } = require('./authen-local-passport')
  const isValidEmail = await willValidateEmail(email)
  if (!isValidEmail) {
    throw new Error('Not valid email')
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willResetPasswordExistingUser } = require('./authen-local-passport')
  const user = await willResetPasswordExistingUser(email, token)

  // Guard
  if (!user) {
    throw new Error(`Can't reset password for : ${email}`)
  }

  // Will send email verification
  const { createPasswordResetURL, createNewPasswordResetURL } = require('./authen-local-passport')
  const base_url = `${req.protocol}://${req.headers.host}`
  const password_reset_url = createPasswordResetURL(base_url, token)
  const new_password_reset_url = createNewPasswordResetURL(base_url)

  // New user, will need verification by email
  const mailer = require('./mailer')
  const msg = await mailer.willSendPasswordReset({ email, password_reset_url, new_password_reset_url })

  // Got verificationURL and msg?
  return msg ? user : new Error(`Can't send email: `, password_reset_url)
}

// Register with email and password
const willSignUp = async (req, email, password) => {
  // Guard
  const { WRONG_EMAIL_PASSWORD_ERROR } = require('./errors')
  const { willValidateEmailAndPassword } = require('./authen-local-passport')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password)
  if (!isValidEmailAndPassword) {
    throw WRONG_EMAIL_PASSWORD_ERROR
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willSignUpNewUser } = require('./authen-local-passport')
  const user = await willSignUpNewUser(email, password, token)

  // Guard
  if (!user) {
    throw new Error(`Can't sign up : ${email}`)
  }

  // Will send email verification
  const { createVerificationURL } = require('./authen-local-passport')
  const verification_url = createVerificationURL(`${req.protocol}://${req.headers.host}`, token)

  // New user, will need verification by email
  const config = require('./config')
  const mailer = require('./mailer')
  const msg = await mailer.willSendVerification({
    mailgun_api_key: config.mailgun_api_key,
    mailgun_domain: config.mailgun_domain,
    email,
    verification_url
  })

  // Got verificationURL and msg?
  return msg ? user : new Error(`Can't send email: `, verification_url)
}

// Login with email
const willLogin = async (req, email, password) => {
  // Guard
  const { WRONG_EMAIL_PASSWORD_ERROR } = require('./errors')  
  const { willValidateEmailAndPassword } = require('./authen-local-passport')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password)
  if (!isValidEmailAndPassword) {
    throw WRONG_EMAIL_PASSWORD_ERROR
  }

  // To let passport-local consume
  req.body.email = email
  req.body.password = password

  // Validate local
  const { willAuthenWithPassport } = require('./passport-authen')
  return await willAuthenWithPassport('local', req).catch(onError(req))
}

const willLogout = async (installationId, userId, sessionToken) => await NAP.Authen.findOneAndUpdate(
  { installationId, userId, sessionToken, isLoggedIn: true },
  {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false,
    sessionToken: null
  },
  { new: true, upsert: false }
)

module.exports = {
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword
}
