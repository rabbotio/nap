const willAuthenWithPassport = (strategy, req) => new Promise((resolve, reject) => {
  const passport = require('passport')
  passport.authenticate(strategy, (err, user) => {
    // Error?
    if (err) { return reject(err) }

    // User?
    return user ? resolve(user) : reject(new Error('Wrong user and/or password'))
  })(req)
})

module.exports = { willAuthenWithPassport }