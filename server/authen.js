// Valid acccessToken?
const willLoginWithFacebook = (req, accessToken) => new Promise((resolve, reject) => {
  debug.info('willLoginWithFacebook:', accessToken)

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
      debug.log('user:', user)
      resolve(user)
      return
    }

    reject(null)
  })(req)
})

const _attachCurrentUserFromSessionToken = req => new Promise((resolve, reject) => {
  if (!req.token) {
    reject(new Error('User has no session provide'))
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
    debug.info('User :', decoded)
    req.currentUser = decoded
    resolve(req)
  })
})

const authenticate = (req, res, next) => {
  (async () => {
    // Validate and decode sessionToken
    await _attachCurrentUserFromSessionToken(req).catch(err => {
      debug.warn(err.message)
      req.nap.error = { code: 401, message: err.message }
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
  debug.log(' * authen :', installationId, userId)

  NAP.Authen.findOneAndUpdate({ installationId }, {
    installationId,
    userId,
    isLoggedIn: true,
    loggedInAt: new Date().toISOString(),
    loggedInWith: provider,
    sessionToken: createSessionToken(installationId, userId)
  }, { new: true, upsert: true }, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

module.exports = { createSessionToken, authenticate, willAuthen, willLoginWithFacebook }