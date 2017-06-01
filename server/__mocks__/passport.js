/* eslint-env jest */
const { WRONG_EMAIL_PASSWORD_ERROR } = require('../errors')
const passport = jest.genMockFromModule('passport');

passport.authenticate = (strategy, callback) => {
  switch (strategy) {
    case 'local': return (req) => {
      if (!req.body.email || !req.body.password) {
        callback(WRONG_EMAIL_PASSWORD_ERROR, null)
      } else {
        callback(null, { _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
      }
    }
    case 'facebook-token': return (req) => {
      if (req.body.access_token === 'WRONG_ACCESS_TOKEN') {
        callback(new Error('Failed to fetch user profile'), null)
      } else {
        callback(null, { _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
      }
    }
  }
}

module.exports = passport