/* eslint-env jest */

process.env.MAILGUN_API_KEY = 'FOO_MAILGUN_API_KEY'
process.env.MAILGUN_DOMAIN = 'BAR_MAILGUN_DOMAIN'

require('../config')

describe('config', () => {
  it('should return config', () => {
    expect(global.NAP.Config).toMatchSnapshot()
  })
})
