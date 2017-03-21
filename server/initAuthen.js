const { createSessionToken } = require('./authen')

const init = ({ port }, app) => {
  // Constants
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  // Add CSRF to all POST requests
  // (If you want to add exceptions to paths you can do that here)
  const csrf = require('lusca').csrf()
  app.use('/auth/*', (req, res, next) => csrf(req, res, next))

  // Add route to get CSRF token via AJAX
  app.get('/auth/csrf', (req, res) => {
    return res.json({ csrfToken: res.locals._csrf })
  })

  // Return session info
  app.get('/auth/session', (req, res) => {
    let session = {
      clientMaxAge: ONE_WEEK,
      csrfToken: res.locals._csrf
    }

    // Add user object to session if logged in
    if (req.user) {
      session.user = req.user

      if (req.user.facebook.token) {
        session.sessionToken = createSessionToken(req.user.facebook.token)
      }
    }

    return res.json(session)
  })
}

module.exports = init
