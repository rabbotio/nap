const { guard, PASSWORD_LENGTH_ERROR } = require('./errors')

const createVerificationURL = (base_url, token) => `${base_url}/auth/local/${token}`
const createPasswordResetURL = (base_url, token) => `${base_url}/auth/reset/${token}`
const createNewPasswordResetURL = (base_url) => `${base_url}/auth/reset`

const willValidateEmail = async (email) => {
  const is = require('is_js')

  guard({ email })

  if (is.not.email(email)) {
    throw new Error('Invalid email')
  }

  return true
}

const willValidatePassword = async (password) => {
  const is = require('is_js')

  guard({ password })

  if (is.not.within(password.length, 5, 256)) {
    throw PASSWORD_LENGTH_ERROR
  }

  return true
}

const willValidateEmailAndPassword = async (email, password) => {
  let isValid = await willValidateEmail(email)
  isValid = isValid && await willValidatePassword(password)
  return isValid
}

const _withHashedPassword = (user, password) => {
  const bcrypt = require('bcryptjs')
  const salt = bcrypt.genSaltSync(10)
  user.hashed_password = bcrypt.hashSync(password, salt)

  return user
}

const _verifiedByEmailPayload = () => ({
  token : null,
  verified : true,
  verifiedAt : new Date().toISOString(),
  status : 'VERIFIED_BY_EMAIL'
})

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

const willSignUpNewUser = async (email, password, token) => {
  // Guard existing user
  const user = await NAP.User.findOne({ email })

  if (user) {
    switch (user.status) {
      case 'WAIT_FOR_EMAIL_VERIFICATION': throw require('./errors').WAIT_FOR_EMAIL_VERIFICATION_ERROR
      case 'VERIFIED_BY_EMAIL' : throw require('./errors').EMAIL_ALREADY_USE_ERROR
    }
  }

  // Create user with email and token, password if any
  const userData = _createNewUserData(email, password, token)
  return await NAP.User.create(userData)
}

const willResetPasswordExistingUser = async (email, token) => {
  // Guard
  guard({ email })
  guard({ token })

  // Use existing user
  return await NAP.User.findOneAndUpdate(
    {
      email
    },
    {
      token,
      status: 'WAIT_FOR_EMAIL_RESET'
    },
    {
      projection: { _id:1, status: 1 },
      new: true,
      upsert: false
    }
  )
}


const _willMarkUserAsVerifiedByToken = async (token) => {
  // Guard
  guard(token)

  // Look up user by token
  const user = await NAP.User.findOneAndUpdate({ token }, _verifiedByEmailPayload())
  if (!user) { throw new Error('Token has been use') }

  return user
}

const _willValidatePassword = async (password, hashed_password) => {
  // Guard
  guard({ password })
  guard({ hashed_password })

  // Password matched?
  const bcrypt = require('bcryptjs')
  return bcrypt.compareSync(password, hashed_password)
}

const validateLocalStrategy = (email, password, done) => {
  // Find by email
  (async () => {
    const user = await NAP.User.findOne({ email, verified: true }).catch(err => err)
    const isPasswordMatch = user && await _willValidatePassword(password, user.hashed_password).catch(err => err)
    return done(null, isPasswordMatch ? user : false)
  })()
}

const auth_local_token = (req, res) => {
  // Guard
  const token = req.params.token
  if (!token || token.trim() === '') {
    return res.redirect('/auth/error/token-not-provided')
  }

  // Verify
  _willMarkUserAsVerifiedByToken(token).then(
    () => res.redirect('/auth/verified')
  ).catch(() => {
    res.redirect('/auth/error/token-not-exist')
  })
}

const reset_password_by_token = (req, res) => {
  (async () => {
    const token = req.body.token
    const password = req.body.password

    const isValid = await willValidatePassword(password).catch(err => res.json({ errors: [err.message] }))
    if (!isValid) { return res.json({ errors: ['token-invalid'] }) }

    let user = await NAP.User.findOne({ token }).catch(err => res.json({ errors: [err.message] }))
    if (!user) { return res.json({ errors: ['user-not-exist'] }) }

    user = _withHashedPassword(user, password)
    user = Object.assign(user, _verifiedByEmailPayload())

    const result = await user.save().catch(err => res.json({ errors: [err.message] }))
    return res.json({ data: { isReset: result ? true : false } })
  })()
}

const auth_local = (req, res) => res.redirect('/auth/welcome')

const handler = {
  auth_local_token,
  reset_password_by_token,
  auth_local
}

module.exports = {
  createVerificationURL,
  createPasswordResetURL,
  createNewPasswordResetURL,
  willSignUpNewUser,
  willValidateEmail,
  willValidatePassword,
  willValidateEmailAndPassword,
  willResetPasswordExistingUser,
  validateLocalStrategy,
  handler,
}
