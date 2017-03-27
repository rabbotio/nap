/* eslint-env jest */
require('../debug')
require('../config')

describe('authen', () => {
  it('should login with Facebook and return user', async () => {
    process.env.FACEBOOK_APP_ID = 'FOO'
    process.env.FACEBOOK_APP_SECRET = 'BAR'

    const authen = require('../authen')
    const accessToken = 'FOO_BAR_TOKEN'
    const user = await authen.willLoginWithFacebook({ body: {} }, accessToken)

    expect(user).toMatchObject({
      _id: expect.any(String),
      name: expect.any(String),
    })
  })

  it('should attach current user from session token after authenticate', async () => {
    const authen = require('../authen')
    const sessionToken = 'FOO_BAR_TOKEN'
    const req = { token: sessionToken, nap: {} }
    await authen.authenticate(req, {}, () => {
      expect(req).toMatchObject({
        token: sessionToken,
        nap: {
          currentUser: {
            _id: expect.any(String),
            name: expect.any(String)
          }
        }
      })
    })
  })

  it('should create session token', () => {
    const authen = require('../authen')
    const installationId = '58d119431e2107009b2cad55'
    const userId = '58d0e20e7ff032b39c2a9a18'
    const sessionToken = authen.createSessionToken(installationId, userId)

    expect(sessionToken).toBe('FOO_BAR_SESSION_TOKEN')
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

    expect(user).toMatchObject({
      _id: expect.any(String),
      name: expect.any(String),
    })
  })

  it('should not attach current user from wrong session token after authenticate', async () => {
    const authen = require('../authen')
    const sessionToken = 'WRONG_TOKEN'
    const req = { token: sessionToken, nap: { errors: [] } }
    await authen.authenticate(req, {}, () => {
      // No user
      expect(req.nap.currentUser).toBeUndefined()

      // Expected : JsonWebTokenError { name: 'JsonWebTokenError', message: 'jwt malformed' }
      expect(req.nap.errors[0]).toMatchObject({
        code: 0,
        message: 'jwt malformed'
      })
    })
  })
})