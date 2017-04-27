const createVerificationURL = (baseURL, token) => `${baseURL}/auth/local/${token}`
const createPasswordResetURL = (baseURL, token) => `${baseURL}/auth/reset/${token}`
const createNewPasswordResetURL = (baseURL) => `${baseURL}/auth/reset`

const willValidateEmail = (email) => new Promise(async (resolve, reject) => {
  const { isEmpty, isEmail } = require('validator')

  if (isEmpty(email)) {
    return reject(new Error('Required : email'))
  }

  if (!isEmail(email)) {
    return reject(new Error('Invalid email'))
  }

  return resolve(true)
})

const willValidatePassword = (password) => new Promise(async (resolve, reject) => {
  const { isEmpty, isLength } = require('validator')

  if (isEmpty(password)) {
    return reject(new Error('Required : password'))
  }

  if (!isLength(password, { min: 6, max: 256 })) {
    return reject(new Error('Password must be in between 6-256 length'))
  }

  return resolve(true)
})

const willValidateEmailAndPassword = (email, password) => new Promise(async (resolve, reject) => {
  let isValid = await willValidateEmail(email).catch(reject)
  isValid = isValid && await willValidatePassword(password).catch(reject)

  return isValid ? resolve(isValid) : reject(new Error('Email and/or Password is invalid'))
})

const _withHashedPassword = (user, password) => {
  const bcrypt = require('bcryptjs')
  const salt = bcrypt.genSaltSync(10)
  user.hashed_password = bcrypt.hashSync(password, salt)

  return user
}

const _withVerifiedByEmail = (user) => {
  user.token = null
  user.verified = true
  user.verifiedAt = new Date().toISOString()
  user.status = 'VERIFIED_BY_EMAIL'
  return user
}

const _createNewUserData = (email, password, token) => _withHashedPassword(
  {
    email,
    name: email.split('@')[0],
    token,
    role: 'user',
    verified: false,
    status: 'WAIT_FOR_EMAIL_VERIFICATION',
  }, 
  password
)

const willSignUpNewUser = (email, password, token) => new Promise((resolve, reject) => {
  // Guard existing user
  NAP.User.findOne({ email }, (err, user) => {
    if (err) {
      return reject(err)
    }

    if (user) {
      return reject(new Error('Email already use'))
    }

    // Create user with email and token, password if any
    const userData = _createNewUserData(email, password, token)
    NAP.User.create(userData, (err, user) => err ? reject(err) : resolve(user))
  })
})

const willResetPasswordExistingUser = (email, token) => new Promise((resolve, reject) => {
  // Guard existing user
  NAP.User.findOne({ email }, (err, user) => {
    if (err) {
      return reject(err)
    }

    if (!user) {
      return reject(new Error('Email not exist'))
    }

    user.token = token
    user.status = 'WAIT_FOR_EMAIL_RESET'
    user.save((err, user) => err ? reject(err) : resolve(user))
  })
})

const _willMarkUserAsVerifiedByToken = token => new Promise((resolve, reject) => {
  // Guard
  if (!token) {
    return reject(new Error('Required : token'))
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
    user = _withVerifiedByEmail(user)
    user.save((err, user) => err ? reject(err) : resolve(user))
  })
})

const _willVerifyPassword = (password, hashed_password) => new Promise((resolve, reject) => {
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
  const isEqual = bcrypt.compareSync(password, hashed_password)
  resolve(isEqual)
})

const init = (app, passport) => {
  // Before verify
  app.get('/auth/local/:token', (req, res) => {
    // Guard
    const token = req.params.token
    if (!token || token.trim() === '') {
      return res.redirect('/auth/error/token-not-provided')
    }

    // Verify
    _willMarkUserAsVerifiedByToken(token).catch(() => res.redirect('/auth/error/token-not-exist'))

    return res.redirect('/auth/verified')
  })

  // After verify
  const LocalStrategy = require('passport-local')
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, (email, password, done) => {
    // Find by email
    NAP.User.findOne({ email, verified: true}, async (err, user) => {
      // Guard
      if (err) { return done(err) }
      if (!user) { return done(null, false) }

      // Verify password
      const isPasswordMatch = await _willVerifyPassword(password, user.hashed_password).catch(() => done(null, false))
      return done(null, isPasswordMatch ? user : false)
    })
  }))

  // reset-password-by-token
  app.post('/reset-password-by-token', (req, res) => {
    const token = req.body.token
    const password = req.body.password

    const isValid = willValidatePassword(password).catch(err => res.json({ errors: [err.message] }))
    if (!isValid) { return res.json({ errors: ['token-invalid'] }) }

    NAP.User.findOne({ token }, (err, user) => {
      // Guard
      if (err) { return res.json({ errors: [err.message] }) }
      if (!user) { return res.json({ errors: ['user-not-exist'] }) }

      user = _withHashedPassword(user, password)
      user = _withVerifiedByEmail(user)

      user.save(err => err ? res.json({ errors: [err.message] }) : res.json({ data: { isReset: true } }))
    })
  })

  // Route
  app.post('/auth/local', passport.authenticate('local', { failureRedirect: '/auth/error' }), (req, res) => res.redirect('/auth/welcome'))
}

module.exports = init
module.exports.createVerificationURL = createVerificationURL
module.exports.createPasswordResetURL = createPasswordResetURL
module.exports.createNewPasswordResetURL = createNewPasswordResetURL
module.exports.willSignUpNewUser = willSignUpNewUser
module.exports.willValidateEmail = willValidateEmail
module.exports.willValidatePassword = willValidatePassword
module.exports.willValidateEmailAndPassword = willValidateEmailAndPassword
module.exports.willResetPasswordExistingUser = willResetPasswordExistingUser
