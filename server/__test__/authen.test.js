/* eslint-env jest */
require('../debug')

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
})