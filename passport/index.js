const index = (app) => {
  const passport = require('passport')

  // Use Facebook
  const FacebookStrategy = require('passport-facebook').Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile)
    }
  ))

  // Configure Passport authenticated session persistence.
  passport.serializeUser((user, cb) => {
    cb(null, user)
  })

  passport.deserializeUser((obj, cb) => {
    cb(null, obj)
  })

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  app.use(require('morgan')('combined'))
  app.use(require('cookie-parser')())
  app.use(require('body-parser').urlencoded({ extended: true }))
  // POC// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

  // Store
  const session = require('express-session')
  const RedisStore = require('connect-redis')(session)
  app.use(session({
    store: new RedisStore({
      url: process.env.REDIS_STORE_URI
    }),
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }))

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/facebook',
    passport.authenticate('facebook'))

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/')
    })

  app.get('/auth/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/')
    })
}

module.exports = index