const init = (app, passport, nextjs) => {
  const path = '/auth'

  // On post request, redirect to page with instrutions to check email for link
  app.post(path + '/email/signin', (req, res) => {

    const email = req.body.email || null

    if (!email || email.trim() === '') {
      return nextjs.render(req, res, 'auth/signin', req.params)
    }

    const uuid = require('uuid/v4')
    const token = uuid()
    const verification_url = 'http://' + req.headers.host + path + '/email/signin/' + token

    // Create verification token save it to database
    // @FIXME Improve error handling
    NAP.User.findOne({ email }, (err, user) => {
      if (err) {
        throw err
      }

      if (user) {
        user.token = token
        user.save((err) => {
          if (err) {
            throw err
          }
        })
      } else {
        // Create user with email and token
        NAP.User.create({ email, token, role: 'user'}, (err) => {
          if (err) {
            throw err
          }

          // Send verification
          const mailer = require('./mailer')
          mailer.sendVerification(email, verification_url)
        })
      }
    })

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