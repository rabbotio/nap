/* eslint-env jest */

const jwt = jest.genMockFromModule('jsonwebtoken');

jwt.verify = (token, secret, callback) => {
  callback(null, { _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
}

jwt.sign = () => 'FOO_BAR_SESSION_TOKEN'

module.exports = jwt