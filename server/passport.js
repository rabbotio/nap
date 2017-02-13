const init = app => {
  const passport = require('passport')
  const secret = process.env.EXPRESS_SESSION_SECRET || 'foo'


  // Configure Passport authenticated session persistence.
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((sessionUser, cb) => cb(null, sessionUser))

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  app.use(require('morgan')('combined'))
  app.use(require('cookie-parser')(secret))

  // Apply
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  // POC// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

  // Passport does not directly manage your session, it only uses the session.
  // So you configure session attributes (e.g. life of your session) via express
  const session = require('express-session')
  const RedisStore = require('connect-redis')(session)
  app.use(
    session({
      store: new RedisStore({
        url: process.env.EXPRESS_SESSION_REDIS_URI || 'redis://redis:6379'
      }),
      secret,
      resave: false, // do not automatically write to the session store
      saveUninitialized: true,
      cookie: { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
    })
  )

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())

  // Initialize providers
  require('./providers')(app, passport)
}

module.exports = init
