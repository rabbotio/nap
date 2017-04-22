// Log in with email
const willLoginWithEmail = (req, email, password) => new Promise(async (resolve, reject) => {
  // Guard
  if (!email) {
    return reject(new Error('Required : email'))
  }

  // To let passport-email consume
  req.body.email = email
  req.body.password = password

  // Will send email verification
  const { willCreateUserWithVerificationURL } = require('./passport-email')
  const { user, verification_url } = await willCreateUserWithVerificationURL(req).catch(reject)

  // Guard
  if (!user) {
    return reject(new Error('No user'))
  }

  // Guard
  if (!verification_url) {
    switch (user.status) {
      case 'VERIFIED_BY_EMAIL':
        return resolve(user)
      case 'VERIFIED_BY_EMAIL_AND_PASSWORD':
        return resolve(user)
      default :
        return reject(new Error(`Can't create verification url`))
    }
  }

  // New user, will need verification by email
  const mailer = require('./mailer')
  const msg = await mailer.willSendVerification(email, verification_url).catch(reject)

  // Got verification_url and msg?
  return msg ? resolve(user) : reject(new Error(`Can't send email: `, user, verification_url))
})

// Valid accessToken?
const willLoginWithFacebook = (req, accessToken) => new Promise((resolve, reject) => {
  // Guard
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    reject(new Error('Required : FACEBOOK_APP_ID, FACEBOOK_APP_SECRET'))
    return
  }

  // To let passport facebook consume
  req.body.access_token = accessToken

  // Validate facebook token
  const passport = require('passport')
  passport.authenticate('facebook-token', (err, user) => {
    // Error?
    if (err) {
      reject(err)
      return
    }

    if (user) {
      resolve(user)
      return
    }

    reject(null)
  })(req)
})

const _attachCurrentUserFromSessionToken = req => new Promise((resolve, reject) => {
  if (!req.token) {
    // Ignore empty token
    return resolve(req)
  }

  const jwt = require('jsonwebtoken')
  jwt.verify(req.token, NAP.Config.jwt_secret, (err, decoded) => {
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
    NAP.Config.jwt_secret
  )

  return sessionToken
}

const _validateUserVerificationState = (provider, status, hashed_password) => {
  // Use email as provider
  if (provider === 'email') {
    switch (status) {
      case 'WAIT_FOR_EMAIL_VERIFICATION':
        // User need to be verified by emailed link 
        return false
      case 'VERIFIED_BY_EMAIL':
        // User need to be verified by emailed link if not provided password
        return hashed_password ? false : true
      case 'VERIFIED_BY_EMAIL_AND_PASSWORD':
        // User need to be verified by emailed link then logged with provided password
        return true
    }
  } else {
    // TODO : Revisit this for more secure
    return true
  }
}

const willAuthen = (installationId, { id: userId, status, hashed_password }, provider) => new Promise(async (resolve, reject) => {
  // Base data
  let authenData = {
    isLoggedIn: false,
    installationId,
    userId,
  }

  // Guard by user status
  const isVerified = _validateUserVerificationState(provider, status, hashed_password)
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
    { installationId },
    authenData,
    { new: true, upsert: true },
    (err, result) => {
      // Error?
      err && debug.error(err) && reject(err)
      // Succeed
      resolve(result)
    })
})

module.exports = { createSessionToken, authenticate, willAuthen, willLoginWithFacebook, willLoginWithEmail }