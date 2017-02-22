const init = ({cookie_secret: secret, redis_url: url}, app, nextjs) => {
  // Constants
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  // Passport
  const passport = require('passport')

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

  // Passport does not directly manage your session, it only uses the session.
  // So you configure session attributes (e.g. life of your session) via express
  const session = require('express-session')
  const RedisStore = require('connect-redis')(session)

  app.use(
    session({
      store: new RedisStore({ url }),
      secret,
      resave: false, // do not automatically write to the session store
      saveUninitialized: true,
      cookie: { httpOnly: true, maxAge: ONE_WEEK } // configure when sessions expires
    })
  )

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())

  // Initialize user/pass authen
  require('./basic-auth')(app, passport, nextjs)

  // Initialize providers
  require('./authen')(app, passport)
}

module.exports = init
