// Log in with email
const willLoginWithEmail = async (req, email) => new Promise( async (resolve, reject) => {
  // Guard
  if (!email ) {
    reject(new Error('Required : email'))
    return
  }

  // To let passport-email consume
  req.body.email = email

  // Will send email verification
  const { willSendVerificationEmail } = require('./passport-email')
  const verification_url = await willSendVerificationEmail(req).catch(err => {
    reject(err)
  })

  // Got verification_url?
  if (verification_url) {
    resolve(verification_url)
  } else {
    reject(new Error('Something wrong'))
  }
})


// Valid acccessToken?
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
    const { SESSION_EMPTY_ERROR } = require('./errors')
    reject(SESSION_EMPTY_ERROR)
    return
  }

  const jwt = require('jsonwebtoken')
  jwt.verify(req.token, NAP.Config.jwt_secret, (err, decoded) => {
    // Error?
    if (err) {
      reject(err)
      return
    }

    // Succeed
    req.nap.currentUser = decoded
    resolve(req)
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

const willAuthen = (installationId, userId, provider) => new Promise((resolve, reject) => {
  NAP.Authen.findOneAndUpdate({ installationId }, {
    installationId,
    userId,
    isLoggedIn: true,
    loggedInAt: new Date().toISOString(),
    loggedInWith: provider,
    sessionToken: createSessionToken(installationId, userId)
  }, { new: true, upsert: true }, (err, result) => {
    // Error?
    err && debug.error(err) && reject(err)
    // Succeed
    resolve(result)
  })
})

module.exports = { createSessionToken, authenticate, willAuthen, willLoginWithFacebook, willLoginWithEmail }