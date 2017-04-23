const createVerificationURL = (base_url, token) => `${base_url}/auth/local/${token}`

const willValidateEmailAndPassword = (email, password) => new Promise(async (resolve, reject) => {
  const { isEmpty, isEmail, isLength } = require('validator')

  if (isEmpty(email)) {
    return reject(new Error('Required : email'))
  }

  if (isEmpty(password)) {
    return reject(new Error('Required : password'))
  }

  if (!isEmail(email)) {
    return reject(new Error('Invalid email'))
  }

  if (!password || password.trim() === '') {
    return reject(new Error('Required : password'))
  }

  if (!isLength(password, { min: 6, max: 256 })) {
    return reject(new Error('Password must be in between 6-256 length'))
  }

  return resolve(true)
})

const createNewUserData = (email, password, token) => {
  const bcrypt = require('bcryptjs')
  const salt = bcrypt.genSaltSync(10)

  return {
    email,
    name: email.split('@')[0],
    token,
    role: 'user',
    status: 'WAIT_FOR_EMAIL_VERIFICATION',
    hashed_password: bcrypt.hashSync(password, salt)
  }
}

const willRegisterNewUser = (email, password, token) => new Promise((resolve, reject) => {
  // Guard existing user
  NAP.User.findOne({ email }, (err, user) => {
    if (err) {
      return reject(err)
    }

    if (user) {
      return reject(new Error('Email already use'))
    }
  })

  // Create user with email and token, password if any
  const userData = createNewUserData(email, password, token)
  NAP.User.create(userData, (err, user) => err ? reject(err) : resolve(user))
})

const _willMarkUserAsVerifiedByToken = token => new Promise((resolve, reject) => {
  // Guard
  if (!token) {
    return reject(new Error('Need token'))
  }

  // Look up user by token
  NAP.User.findOne({ token }, (err, user) => {
    // Guard
    if (err) {
      return reject(err)
    }

    // Guard
    if (!user) {
      return reject(new Error('No user found for this token:', token))
    }

    // Reset token and mark as verified
    user.token = null
    user.verified = true
    user.verifiedAt = new Date().toISOString()
    user.status = 'VERIFIED_BY_EMAIL'
    user.save((err, user) => {
      // Guard
      if (err) {
        return reject(err)
      }

      return resolve(user)
    })
  })
})

const _verifyPassword = (password, hashed_password) => new Promise((resolve, reject) => {
  // Guard
  if (!password) {
    return reject(new Error('Required : password'))
  }

  // Guard
  if (!hashed_password) {
    return reject(new Error('Required : hashed password'))
  }

  // Password matched?
  const bcrypt = require('bcryptjs')
  return resolve(bcrypt.compareSync(password, hashed_password))
})

const init = (app, passport) => {
  // Before verify
  app.get('/auth/local/:token', (req, res) => {
    // Guard
    const token = req.params.token
    if (!token || token.trim() === '') {
      return res.redirect('/local-error-token')
    }

    // Verify
    _willMarkUserAsVerifiedByToken(token).catch(() => res.redirect('/auth/local-error-token'))

    return res.redirect('/auth/local-verify')
  })

  // After verify
  const LocalStrategy = require('passport-local')
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    // Find by email
    NAP.User.findOne({ email }, (err, user) => {
      // Guard
      if (err) { return done(err) }
      if (!user) { return done(null, false) }

      // Verify email?
      if (!user.verified) {
        return done(null, false)
      }

      // Compare password
      if (!_verifyPassword(password, user.hashed_password)) {
        return done(null, false)
      }

      // Succeed
      return done(null, user)
    })
  }))

  // Route
  app.post('/auth/local', passport.authenticate('local', { failureRedirect: '/auth/error' }), (req, res) => res.redirect('/auth/welcome'))
}

module.exports = init
module.exports.createVerificationURL = createVerificationURL
module.exports.willRegisterNewUser = willRegisterNewUser
module.exports.willValidateEmailAndPassword = willValidateEmailAndPassword
