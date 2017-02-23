const init = ({ port }, app, nextjs) => {
  // Constants
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  // Custom routes
  try {
    require('../routes')(app, nextjs)
  } catch (err) {
    // Never mind.
    debug.warn(err)
  }

  // Add route to get CSRF token via AJAX
  app.get('/auth/csrf', (req, res) => {
    return res.json({csrfToken: res.locals._csrf})
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
    }

    return res.json(session)
  })

  // Default catch-all handler to allow Next.js to handle all other routes
  const handler = nextjs.getRequestHandler()
  app.all('*', (req, res) => handler(req, res))

  // Server
  app.listen(port, (err) => {
    if (err) throw err
    debug.info(`NextJS  : http://localhost:${port}`)
  })
}

module.exports = init
