const init = (app, passport) => {
  // Guard
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return // Ignore error
  }

  const FacebookTokenStrategy = require('passport-facebook-token')
  const { guard } = require('./errors')
  const is = require('is_js')

  // @ts-ignore
  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    delete profile._raw
    delete profile._json

    // Guard email
    const email = profile.emails[0].value
    guard({ email })
    if (is.not.email(email)) {
      throw new Error('Invalid email')
    }

    // Upsert data
    const payload = {
      email,
      name: profile.displayName,
      facebook: {
        id: profile.id,
        token: accessToken,
        profile,
      },
    }

    // Will find someone that has this email and update token 
    NAP.User.findOneAndUpdate({
      email: payload.email
    }, payload,
      { new: true, upsert: true },
      (err, user) => err ? done(err, null) : done(err, user)
    )
  }))

  // Route
  app.post('/auth/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    // do something with req.user
    res.json(req.user)
  })
}

module.exports = init
