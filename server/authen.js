let providers = []

const init = (app, passport) => {

  // Initialize all providers
  try {
    require('../providers')(providers)
  } catch (err) {
    // Never mind.
    debug.warn(err)
    return
  }

  // Define a Passport strategy for provider
  providers.forEach(({provider, Strategy, strategyOptions, getUserFromProfile}) => {
    strategyOptions.callbackURL = `http://localhost:${NAP.Config.port}/auth/${provider}/callback`
    strategyOptions.passReqToCallback = true

    passport.use(new Strategy(strategyOptions, (req, accessToken, refreshToken, profile, done) => {
      try {
        // Normalise the provider specific profile into a User object
        profile = getUserFromProfile(profile)

        // See if we have this oAuth account in the database associated with a user
        NAP.User.findOne({
          socials: {
            id: profile.id,
            provider
          }
        }).exec((err, user) => {
          if (err) {
            return done(err)
          }

          // If the current session is signed in
          if (req.user) {

            // If the oAuth account is not linked to another account, link it and exit
            if (!user) {
              return NAP.User.findOne({ id: req.user.id }, (err, user) => {
                if (err) {
                  return done(err)
                }

                user.name = user.name || profile.name
                user[provider] = new NAP.Authen({
                  id : profile.id,
                  token : accessToken
                })
                user.save((err) => done(err, user))
              })
            }

            // If oAuth account already linked to the current user, just exit
            if (req.user.id === user.id) {
              return done(null, user)
            }

            // If the oAuth account is already linked to different account, exit with error
            if (req.user.id !== user.id) {
              return done(new Error('This account is already associated with another login.'))
            }
          } else {
            // If the current session is not signed in

            // If we have the oAuth account in the db then let them sign in as that user
            if (user) {
              return done(null, user)
            }

            // If we don't have the oAuth account in the db, check to see if an account with the
            // same email address as the one associated with their oAuth acccount exists in the db
            return NAP.User.findOne({ email: profile.email }, (err, user) => {
              if (err) {
                return done(err)
              }
              // If we already have an account associated with that email address in the databases, the user
              // should sign in with that account instead (to prevent them creating two accounts by mistake)
              // Note: Automatically linking them here could expose a potential security exploit allowing someone
              // to create an account for another users email address in advance then hijack it, so don't do that.
              if (user) {
                return done(new Error('There is already an account associated with the same email address.'))
              }

              // If account does not exist, create one for them and sign the user in
              NAP.User.create({
                name: profile.name,
                email: profile.email,
                socials: { 
                  id: profile.id,
                  provider
                }
              }, (err, user) => err ? done(err) : done(null, user))
            })
          }
        })
      } catch (err) {
        done(err)
      }
    }))
  })

  // Add routes for provider
  providers.forEach(({provider, scope}) => {
    app.get(
      `/auth/${provider}`,
      passport.authenticate(provider, { scope })
    )

    app.get(
      `/auth/${provider}/callback`,
      passport.authenticate(provider, { failureRedirect: '/auth/signin' }),
      (req, res) => {
        // Redirect to the sign in success, page which will force the client to update it's cache
        res.redirect('/about')
      })

    app.get(
      `/auth/${provider}/return`,
      passport.authenticate(provider, { failureRedirect: '/auth/signin' }),
      (req, res) => {
        // Successful authentication, redirect home.ß
        res.redirect('/auth/success')
      })
  })
}

exports.providers = providers
module.exports = init