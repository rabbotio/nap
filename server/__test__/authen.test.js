/* eslint-env jest */
process.env.FACEBOOK_APP_ID = 'FOO_FACEBOOK_APP_ID'
process.env.FACEBOOK_APP_SECRET = 'BAR_FACEBOOK_APP_SECRET'
process.env.MAILGUN_API_KEY = 'FOO_MAILGUN_API_KEY'
process.env.MAILGUN_DOMAIN = 'BAR_MAILGUN_DOMAIN'

require('../config')
require('../debug')

describe('authen', () => {
  it('should login with Facebook and return user', async () => {
    const authen = require('../authen')
    const accessToken = 'FOO_BAR_TOKEN'
    const user = await authen.willLoginWithFacebook({ body: {} }, accessToken)

    expect(user).toMatchSnapshot()
  })

  it('should not login with Facebook and return error for wrong token', async () => {
    const authen = require('../authen')
    const accessToken = 'WRONG_ACCESS_TOKEN'
    await authen.willLoginWithFacebook({ body: {} }, accessToken).catch(err => {
      expect(() => { throw err }).toThrow('Failed to fetch user profile')
    })
  })

  it('should attach current user from session token after authenticate', async () => {
    const authen = require('../authen')
    const sessionToken = 'FOO_BAR_TOKEN'
    const req = { token: sessionToken, nap: {} }
    await authen.authenticate(req, {}, () => {
      expect(req).toMatchSnapshot()
    })
  })

  it('should create session token', () => {
    const authen = require('../authen')
    const installationId = '58d119431e2107009b2cad55'
    const userId = '58d0e20e7ff032b39c2a9a18'
    const sessionToken = authen.createSessionToken(installationId, userId)

    expect(sessionToken).toMatchSnapshot()
  })

  it('should authen and return user', async () => {
    // stub
    NAP.Authen = {
      findOneAndUpdate: (find, update, options, callback) => callback(null, { _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
    }

    const authen = require('../authen')
    const installationId = 'FOO_INSTALLATION_ID'
    const userId = 'FOO_USER_ID'
    const provider = 'facebook'
    const user = await authen.willAuthen(installationId, userId, provider)

    expect(user).toMatchSnapshot()
  })

  it('should not attach current user to nap from wrong session token after authenticate', async () => {
    const authen = require('../authen')
    const sessionToken = 'WRONG_TOKEN'
    const req = { token: sessionToken, nap: { errors: [] } }
    await authen.authenticate(req, {}, () => {
      // Should be no user
      expect(req.nap.currentUser).toBeUndefined()

      // Expected : JsonWebTokenError { name: 'JsonWebTokenError', message: 'jwt malformed' }
      expect(req.nap).toMatchSnapshot()
    })
  })

  it('should allow to login with email', async () => {
    // stub
    NAP.User = {
      findOne: (find, callback) => callback(null, null),
      create: (data, callback) => callback(null, null),
    }

    const authen = require('../authen')

    const req = { headers: { host: 'localhost:3000' }, body: {} }
    const email = 'katopz@gmail.com'
    const result = await authen.willLoginWithEmail(req, email)
    expect(result).toEqual(expect.stringContaining('http://localhost:3000/auth/email/signin/'))
  })
})