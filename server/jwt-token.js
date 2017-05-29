const { onError } = require('./errors')

const _willAttachCurrentUserFromSessionToken = req => new Promise((resolve, reject) => {
  // Ensure no session
  req.nap.session = null

  //Guard
  if (!req.token) {
    // Ignore empty token
    return resolve(req)
  }

  const config = require('./config')
  const jwt = require('jsonwebtoken')
  jwt.verify(req.token, config.jwt_secret, (err, decoded) => {
    // Error?
    if (err) {
      return reject(err)
    }

    // Succeed
    req.nap.session = decoded
    return resolve(req)
  })
})

const authenticate = (req, res, next) => {
  (async () => {
    // Validate and decode sessionToken
    await _willAttachCurrentUserFromSessionToken(req).catch(onError(req))

    // Done
    next()
  })()
}

const createSessionToken = (installationId, userId) => {
  const config = require('./config')
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

module.exports = {
  authenticate,
  createSessionToken
}
