/* eslint-env jest */
process.env.FACEBOOK_APP_ID = 'FOO'
process.env.FACEBOOK_APP_SECRET = 'BAR'

require('../debug')
require('../config')

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

  /* TODO
  it('should allow to login with email', async () => {
    const authen = require('../authen')
    const req = { body: {} }
    const email = 'x@x.com'
    const result = await authen.willLoginWithEmail(req, email)
    expect(result).toMatchSnapshot()
  })
  */
})