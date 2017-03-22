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
})