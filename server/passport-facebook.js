const init = (app, passport) => {
  // Required
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) return

  const FacebookTokenStrategy = require('passport-facebook-token')

  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
  }, (accessToken, refreshToken, profile, done) => {

    // TODO : Handle no email
    const email = profile.emails[0].value

    debug.log('accessToken:', accessToken)
    debug.log('profile:', profile)
    profile && debug.log('profile.email:', email)

    // Will find someone that has this email and upsert token 
    NAP.User.findOneAndUpdate({
      // Find someone that has this email
      email
    }, {
        // Upsert with current accessToken
        facebook: {
          id: profile.id,
          token: accessToken
        }
      }, (error, user) =>  {
        debug.log('findOneAndUpdate:', user)
        done(error, user)
      })
  }))

  // Route
  app.all('/auth/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
      // do something with req.user
      res.json(req.user)
    }
  )
}

module.exports = init
