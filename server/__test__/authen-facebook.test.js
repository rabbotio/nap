/* eslint-env jest */
process.env.FACEBOOK_APP_ID = 'FOO_FACEBOOK_APP_ID'
process.env.FACEBOOK_APP_SECRET = 'BAR_FACEBOOK_APP_SECRET'
process.env.MAILGUN_API_KEY = 'FOO_MAILGUN_API_KEY'
process.env.MAILGUN_DOMAIN = 'BAR_MAILGUN_DOMAIN'

require('../debug')

describe('authen-facebook', () => {
    it('should login with Facebook and return user', async () => {
        const authen = require('../authen-facebook')
        const accessToken = 'FOO_BAR_TOKEN'
        const user = await authen.willLoginWithFacebook({ body: {} }, accessToken)

        expect(user).toMatchSnapshot()
    })

    it('should not login with Facebook and return error for wrong token', async () => {
        const authen = require('../authen-facebook')
        const accessToken = 'WRONG_ACCESS_TOKEN'
        await authen.willLoginWithFacebook({ body: {}, nap: { errors: [] } }, accessToken).catch(err => {
            expect(() => { throw err }).toThrow('Failed to fetch user profile')
        })
    })

    it('should attach current user from session token after authenticate', async () => {
        const authen = require('../jwt-token')
        const sessionToken = 'FOO_BAR_TOKEN'
        const req = { token: sessionToken, nap: {} }
        await authen.authenticate(req, {}, () => {
            expect(req).toMatchSnapshot()
        })
    })

    it('should create session token', () => {
        const authen = require('../jwt-token')
        const installationId = '58d119431e2107009b2cad55'
        const userId = '58d0e20e7ff032b39c2a9a18'
        const sessionToken = authen.createSessionToken(installationId, userId)

        expect(sessionToken).toMatchSnapshot()
    })

    it('should not attach current user to nap from wrong session token after authenticate', async () => {
        const authen = require('../jwt-token')
        const sessionToken = 'WRONG_TOKEN'
        const req = { token: sessionToken, nap: { errors: [] } }
        await authen.authenticate(req, {}, () => {
            // Should be no user
            expect(req.nap.session).toBeNull()

            // Expected : JsonWebTokenError { name: 'JsonWebTokenError', message: 'jwt malformed' }
            expect(req.nap).toMatchSnapshot()
        })
    })

    /* TOFIX
    it('should allow to login with email and password after verified', async () => {
      // stub
      const { createUserData } = require('../passport-email')
      let userObject = createUserData('katopz@gmail.com', 'bar', 'baz')
      userObject.save = (callback) => callback(null, Object.assign(userObject, {
          isLoggedIn: true,
          status: 'VERIFIED_BY_EMAIL_AND_PASSWORD'
      }))
      userObject = Object.assign(userObject, {
          _id: '58d0e20e7ff032b39c2a9a18',
          hashed_password: '$2a$10$y.KDZtTQqM3lYTiXLugupuTmD.s1zTpHi3sYpo62vvWfVtulQMytW',
          name: 'bar',
          status: 'VERIFIED_BY_EMAIL',
          isLoggedIn: false,
      })
  
      NAP.User = {
        findOne: (find, callback) => callback(null, userObject),
        create: (data, callback) => callback(null, userObject),
      }
  
      const authen = require('../authen-facebook')
  
      const req = { headers: { host: 'localhost:3000' }, body: {}, logIn: user => Object.assign(user, {
        isLoggedIn: true,
        status: 'VERIFIED_BY_EMAIL_AND_PASSWORD'
      }) }
      const email = 'katopz@gmail.com'
      const password = 'bar'
      const user = await authen.willLoginWithEmail(req, email, password)
      delete user.save
      expect(user).toMatchSnapshot()
    })
    */
})