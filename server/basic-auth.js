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
    const verificationUrl = 'http://' + req.headers.host + path + '/email/signin/' + token

    debug.log('NAP.User.findOne :', email)

    // Create verification token save it to database
    // @FIXME Improve error handling
    NAP.User.findOne({ email: email }, function (err, user) {
      if (err) {
        throw err
      }

      if (user) {
        debug.log('NAP.User.found :', email)
        user.token = token

        debug.log('NAP.User.save :', token)
        user.save(function (err) {
          if (err) {
            throw err
          }
        })
      } else {

        debug.log('Create user.email :', email)
        debug.log('Create user.token :', token)

        NAP.User.create({ email, token, role: 'user'}, function (err) {
          if (err) {
            throw err
          }

          debug.log('Send verification url :', verificationUrl)
          const nodemailer = require('nodemailer')
          nodemailer
            .createTransport({
              service: 'Gmail',
              auth: {
                user: NAP.Config.email_user,
                pass: NAP.Config.email_pass
              },
              logger: require('bunyan').createLogger({
                name: 'nodemailer'
              }),
              debug: true // include SMTP traffic in the logs
            })
            .sendMail({
              to: email,
              from: 'noreply@' + req.headers.host.split(':')[0],
              subject: 'Sign in link',
              text: 'Use the link below to sign in:\n\n' + verificationUrl + '\n\n'
            }, function (err) {
              // @TODO Handle errors
              if (err) {
                console.log('Generated sign in link ' + verificationUrl + ' for ' + email)
                console.log('Error sending email to ' + email, err)
              }
            })
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
    NAP.User.findOne({ token: req.params.token }, function (err, user) {
      if (err) {
        return res.redirect(path + '/error')
      }
      if (user) {
        // Reset token and mark as verified
        user.token = null
        user.verified = true
        user.save(function (err) {
          // @TODO Improve error handling
          if (err) {
            return res.redirect(path + '/error')
          }
          // Having validated to the token, we log the user with Passport
          req.logIn(user, function (err) {
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