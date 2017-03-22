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
})