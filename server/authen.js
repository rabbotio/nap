const config = require('./config')

// Forget password
const willResetPassword = (req, email) => new Promise(async (resolve, reject) => {
  // Guard
  const { willValidateEmail } = require('./passport-local')
  const isValidEmail = await willValidateEmail(email).catch(reject)
  if (!isValidEmail) {
    return reject(new Error('Not valid email'))
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willResetPasswordExistingUser } = require('./passport-local')
  const user = await willResetPasswordExistingUser(email, token).catch(reject)

  // Guard
  if (!user) {
    return reject(new Error(`Can't reset password for : ${email}`))
  }

  // Will send email verification
  const { createPasswordResetURL, createNewPasswordResetURL } = require('./passport-local')
  const baseURL = `${req.protocol}://${req.headers.host}`
  const passwordResetURL = createPasswordResetURL(baseURL, token)
  const newPasswordResetURL = createNewPasswordResetURL(baseURL)

  // New user, will need verification by email
  const mailer = require('./mailer')
  const msg = await mailer.willSendPasswordReset(email, passwordResetURL, newPasswordResetURL).catch(reject)

  // Got verificationURL and msg?
  return msg ? resolve(user) : reject(new Error(`Can't send email: `, passwordResetURL))
})

// Register with email and password
const willSignUp = (req, email, password) => new Promise(async (resolve, reject) => {
  // Guard
  const { willValidateEmailAndPassword } = require('./passport-local')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password).catch(reject)
  if (!isValidEmailAndPassword) {
    return reject(new Error('Not valid email and/or password'))
  }

  // Token
  const token = require('uuid/v4')()

  // Validate receiver
  const { willSignUpNewUser } = require('./passport-local')
  const user = await willSignUpNewUser(email, password, token).catch(reject)

  // Guard
  if (!user) {
    return reject(new Error(`Can't sign up : ${email}`))
  }

  // Will send email verification
  const { createVerificationURL } = require('./passport-local')
  const verificationURL = createVerificationURL(`${req.protocol}://${req.headers.host}`, token)

  // New user, will need verification by email
  const mailer = require('./mailer')
  const msg = await mailer.willSendVerification(email, verificationURL).catch(reject)

  // Got verificationURL and msg?
  return msg ? resolve(user) : reject(new Error(`Can't send email: `, verificationURL))
})

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
const willLogin = (req, email, password) => new Promise(async (resolve, reject) => {
  // Guard
  const { willValidateEmailAndPassword } = require('./passport-local')
  const isValidEmailAndPassword = await willValidateEmailAndPassword(email, password).catch(reject)
  if (!isValidEmailAndPassword) {
    return reject(new Error('Not valid email and/or password'))
  }

  // To let passport-local consume
  req.body.email = email
  req.body.password = password

  // Validate local
  const user = _willAuthenticateWithPassport('local', req).catch(reject)
  return user ? resolve(user) : reject(new Error('Authentication failed'))
})

// Valid accessToken?
const willLoginWithFacebook = (req, accessToken) => new Promise((resolve, reject) => {
  // Guard
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return reject(new Error('Required : FACEBOOK_APP_ID, FACEBOOK_APP_SECRET'))
  }

  // Guard
  const { isEmpty } = require('validator')
  if (isEmpty(accessToken)) {
    return reject(new Error('Required : accessToken'))
  }

  // To let passport-facebook-token consume
  req.body.access_token = accessToken

  // Validate facebook token
  const user = _willAuthenticateWithPassport('facebook-token', req).catch(reject)
  return user ? resolve(user) : reject(new Error('Authentication failed'))
})

const _attachCurrentUserFromSessionToken = req => new Promise((resolve, reject) => {
  if (!req.token) {
    // Ignore empty token
    return resolve(req)
  }

  const jwt = require('jsonwebtoken')
  jwt.verify(req.token, config.jwt_secret, (err, decoded) => {
    // Error?
    if (err) {
      return reject(err)
    }

    // Succeed
    req.nap.currentUser = decoded
    return resolve(req)
  })
})

const authenticate = (req, res, next) => {
  (async () => {
    // Validate and decode sessionToken
    await _attachCurrentUserFromSessionToken(req).catch(err => {
      debug.warn(err.message)
      req.nap.errors.push({ code: err.code || 0, message: err.message })
    })

    // Done
    next()
  })()
}

const createSessionToken = (installationId, userId) => {
  const jwt = require('jsonwebtoken')
  const sessionToken = jwt.sign({
    installationId,
    userId,
    createdAt: new Date().toISOString()
  },
    config.jwt_secret
  )

  return sessionToken
}

const willAuthen = (installationId, { _id: userId, verified }, provider) => new Promise(async (resolve, reject) => {
  // Base data
  let authenData = {
    isLoggedIn: false,
    installationId,
    userId
  }

  // Guard by user local verification if has
  const isVerified = (provider === 'local') ? verified : true
  if (isVerified) {
    authenData = Object.assign(authenData, {
      isLoggedIn: isVerified,
      loggedInAt: new Date().toISOString(),
      loggedInWith: provider,
      sessionToken: createSessionToken(installationId, userId)
    })
  }

  // Allow to authen
  NAP.Authen.findOneAndUpdate(
    { installationId, userId },
    authenData,
    { new: true, upsert: true },
    (err, result) => err ? reject(err) : resolve(result)
  )
})

const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
  NAP.Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false
  }, { new: true, upsert: false }, (err, result) => err ? reject(err) : resolve(result))
})

module.exports = {
  createSessionToken,
  authenticate,
  willAuthen,
  willLoginWithFacebook,
  willSignUp,
  willLogin,
  willLogout,
  willResetPassword
}
