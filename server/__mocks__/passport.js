/* eslint-env jest */

const passport = jest.genMockFromModule('passport');

passport.authenticate = (strategy, callback) => {
  switch (strategy) {
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