/* eslint-env jest */

const passport = jest.genMockFromModule('passport');

passport.authenticate = (strategy, callback) => {
  callback(null, { _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
}

module.exports = passport