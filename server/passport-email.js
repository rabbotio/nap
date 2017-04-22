const createUserData = (email, password, token) => {
  let userData = {
    email,
    name: email.split('@')[0],
    token,
    role: 'user',
    status: 'WAIT_FOR_EMAIL_VERIFICATION'
  }

  // Use password if any
  if (password) {
    const bcrypt = require('bcryptjs')
    const salt = bcrypt.genSaltSync(10)
    const hashed_password = bcrypt.hashSync(password, salt)

    userData = Object.assign(userData, { hashed_password })
  }

  return userData
}

const _willVerifyUserByEmailAndPassword = user => new Promise((resolve, reject) => {
  // Guard
  if (!user) {
    return reject(new Error('User not exist'))
  }

  user.status = 'VERIFIED_BY_EMAIL_AND_PASSWORD'

  try{
    user.save((err, user) => err ? reject(err) : resolve(user))
  } catch(err) {
    reject(err)
  }
})

const _willLogInEmailAndPasswordUserIfNeed = (req, user) => new Promise((resolve, reject) => {
  // User already logged in
  if(req.nap && req.nap.currentUser) {
    return resolve(user)
  }

  // User not logged in yet, do it!
  req.logIn(user, err => err ? reject(err) : resolve(user))
})

const _willLogInUserIfHasPassword = (req, user, password) => new Promise(async (resolve, reject) => {
  // User did sign in with password
  const hashed_password = user.hashed_password
  if (password && hashed_password) {
    // Password matched?
    const bcrypt = require('bcryptjs')
    if (hashed_password && bcrypt.compareSync(password, hashed_password)) {
      const verifiedUser = await _willVerifyUserByEmailAndPassword(user)
      const loggedInVerifiedUser = await _willLogInEmailAndPasswordUserIfNeed(req, verifiedUser)
      return resolve(loggedInVerifiedUser)
    } else {
      return reject(new Error('Password mismatch'))
    }
  }

  return resolve(user)
})

const willCreateUserWithVerificationURL = (req) => new Promise((resolve, reject) => {
  const email = req.body.email || null
  const password = req.body.password || null

  if (!email || email.trim() === '') {
    reject(new Error('Require email'))
  }

  // Create verification token save it to database
  // @FIXME Improve error handling
  NAP.User.findOne({ email }, async (err, user) => {
    if (err) {
      return reject(err)
    }

    if (user && user.status) {
      switch (user.status) {
        case 'WAIT_FOR_EMAIL_VERIFICATION':
          return reject(new Error('Email already use'))
        case 'VERIFIED_BY_EMAIL':
          {
            const _user = await _willLogInUserIfHasPassword(req, user, password).catch(reject)
            return resolve({ user: _user })
          }
        case 'VERIFIED_BY_EMAIL_AND_PASSWORD':
          {
            const _user = await _willLogInEmailAndPasswordUserIfNeed(req, user).catch(reject)
            return resolve({ user: _user })
          }
        default :
        return reject(new Error('User status not found'))
      }
    } else {
      // Create verification link
      const uuid = require('uuid/v4')
      const token = uuid()
      const verification_url = 'http://' + req.headers.host + '/auth/email/signin/' + token

      // Create user with email and token, password if any
      const userData = createUserData(email, password, token)

      // Create user
      NAP.User.create(userData, (err, user) => err ? reject(err) : resolve({
        user,
        verification_url
      }))
    }
  })
})

const init = (app, passport, nextjs) => {
  const path = '/auth'

  // On post request, redirect to page with instructions to check email for link
  app.post(path + '/email/signin', (req, res) => async () => {
    await willCreateUserWithVerificationURL(req)

    return nextjs.render(req, res, 'auth/check-email', req.params)
  })

  app.get(path + '/email/signin/:token', (req, res) => {
    const token = req.params.token

    if (!token) {
      return res.redirect(path + '/signin')
    }

    // Look up user by token
    NAP.User.findOne({ token }, (err, user) => {
      if (err || !user) {
        return res.redirect(path + '/error')
      }

      // Reset token and mark as verified
      user.token = null
      user.verified = true
      user.status = 'VERIFIED_BY_EMAIL'
      user.save((err) => {
        // @TODO Improve error handling
        if (err) {
          return res.redirect(path + '/error')
        }

        // User had password to verify
        if (user.hashed_password) {
          return res.redirect(path + '/signin')
        }

        // Having validated to the token, we log the user with Passport
        req.logIn(user, err => err ? res.redirect(path + '/error') : res.redirect(path + '/success'))
      })
    })
  })

  app.post(path + '/signout', (req, res) => {
    // Log user out by disassociating their account from the session
    req.logout()
    res.redirect('/')
  })
}

module.exports = init
module.exports.willCreateUserWithVerificationURL = willCreateUserWithVerificationURL
module.exports.createUserData = createUserData
