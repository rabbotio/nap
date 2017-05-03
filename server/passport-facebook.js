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
        token: accessToken,
        profile,
      },
    };

    // Will find someone that has this email and update token 
    NAP.User.findOneAndUpdate({
      email: payload.email
    }, payload, { new: true, upsert: true }, (err, user) => {
      // Error?
      err && debug.error(err)

      // Return existing user
      if (user) {
        done(err, user)
        return
      }
    })
  }))

  // Route
  app.post('/auth/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    // do something with req.user
    res.json(req.user)
  })
}

module.exports = init
