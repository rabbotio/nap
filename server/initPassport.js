const init = ({ cookie_secret: secret, redis_url: url }, app) => {
  // Constants
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

  // Passport
  const passport = require('passport')

  // Configure Passport authenticated session persistence.
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => NAP.User.findOne({ _id: id }, { id: 1, name: 1 }, done))

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
      saveUninitialized: false,
      cookie: { httpOnly: true, maxAge: ONE_WEEK } // configure when sessions expires
    })
  )

  // Initialize Passport and restore authentication state, if any, from the session.
  app.use(passport.initialize())
  app.use(passport.session())

  // Accept bearer token as req.token
  const bearerToken = require('express-bearer-token')
  app.use(bearerToken())

  // Initialize local
  require('./passport-local')(app, passport)

  // Initialize providers
  require('./passport-providers')(app, passport)

  // Will accept Facebook token
  require('./passport-facebook')(app, passport)
}

module.exports = init
