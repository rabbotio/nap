const init = (app, passport) => {
  // Required
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) return

  const FacebookTokenStrategy = require('passport-facebook-token')

  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
  }, (accessToken, refreshToken, profile, done) => {

    // Upsert data
    const payload = {
      email: profile.emails[0].value,
      name: profile.displayName,
      facebook: {
        id: profile.id,
        token: accessToken
      }
    }

    // Will find someone that has this email and update token 
    NAP.User.findOneAndUpdate({
      email: payload.email
    }, payload, { upsert: true }, (error, user) => {
      // Error?
      error && debug.error(error)

      // User is exist
      if (user) {
        done(error, user)
        return
      }

      // User just get upsert, find them!
      NAP.User.findOne({
        email: payload.email
      }, (error, user) => {
        // Error?
        error && debug.error(error)

        // User is exist
        done(error, user)
        return
      })
    })
  }))

  // Route
  app.post('/auth/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    req.user && debug.log('req.user:', req.user)
    // do something with req.user
    res.json(req.user)
  })
}

module.exports = init
