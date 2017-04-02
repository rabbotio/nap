const willCreateUserWithVerificationURL = (req) => new Promise((resolve, reject) => {
  const email = req.body.email || null

  if (!email || email.trim() === '') {
    reject(new Error('Require email'))
  }

  const uuid = require('uuid/v4')
  const token = uuid()
  const verification_url = 'http://' + req.headers.host + '/auth/email/signin/' + token

  // Create verification token save it to database
  // @FIXME Improve error handling
  NAP.User.findOne({ email }, (err, user) => {
    if (err) {
      reject(err)
    }

    if (user) {
      // TODO : Need some other wauy to handle this
      debug.warn('User already exist for :', email)
      user.token = token
      user.save((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    } else {
      // Create user with email and token
      NAP.User.create({ email, token, role: 'user', status: 'WAIT_FOR_EMAIL_VERIFICATION' }, (err) => {
        if (err) {
          reject(err)
        }

        // Return verification URL
        resolve(verification_url)
      })
    }
  })
})

const init = (app, passport, nextjs) => {
  const path = '/auth'

  // On post request, redirect to page with instrutions to check email for link
  app.post(path + '/email/signin', (req, res) => async () => {
    await willCreateUserWithVerificationURL(req)

    return nextjs.render(req, res, 'auth/check-email', req.params)
  })

  app.get(path + '/email/signin/:token', (req, res) => {
    if (!req.params.token) {
      return res.redirect(path + '/signin')
    }

    // Look up user by token
    NAP.User.findOne({ token: req.params.token }, (err, user) => {
      if (err) {
        return res.redirect(path + '/error')
      }
      if (user) {
        // Reset token and mark as verified
        user.token = null
        user.verified = true
        user.status = 'VERIFIED_BY_EMAIL'
        user.save((err) => {
          // @TODO Improve error handling
          if (err) {
            return res.redirect(path + '/error')
          }
          // Having validated to the token, we log the user with Passport
          req.logIn(user, (err) => {
            if (err) {
              return res.redirect(path + '/error')
            }
            return res.redirect(path + '/success')
          })
        })
      } else {
        return res.redirect(path + '/error')
      }
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
