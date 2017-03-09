// Valid acccessToken?
const willLoginWithFacebook = req => new Promise((resolve, reject) => {
  // Validate facebook token
  const passport = require('passport')
  passport.authenticate('facebook-token', (error, user) => {
    if (user) {
      debug.log('user:', user)
      resolve(user)
    } else {
      debug.warn('No facebook access_token provide')
      reject(null)
    }
  })(req)
})

const jwt = require('jsonwebtoken')
// Validate and decode sessionToken
const createCurrentUserFromSessionToken = req => new Promise((resolve, reject) => {
  if (!req.token) {
    reject(new Error('User has no session provide'))
    return
  }

  jwt.verify(req.token, NAP.Config.jwt_secret, (err, decoded) => {
    // Error?
    if (err || !decoded) {
      reject(err)
      return
    }

    // Succeed
    debug.info(decoded)
    req.currentUser = decoded
    resolve(req)
  })
})

const authenticate = (req, res, next) => {
  (async () => {
    // Validate and decode sessionToken
    await createCurrentUserFromSessionToken(req).catch(err => debug.warn(err.message))

    // Inject passport validator
    req.willLoginWithFacebook = accessToken => (req.body.access_token = accessToken) && willLoginWithFacebook(req)

    // Done
    next()
  })()
}

const createSessionToken = (installationId, userId) => {
  const sessionToken = jwt.sign({
    installationId,
    userId,
    createdAt: new Date().toISOString()
  },
    NAP.Config.jwt_secret
  )

  return sessionToken
}

const isLoggedIn = (req) => {
  return !!req.currentUser
}

module.exports = { createSessionToken, authenticate, isLoggedIn}