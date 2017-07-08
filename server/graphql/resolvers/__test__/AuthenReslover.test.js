/* eslint-env jest */
describe('AuthenResolver', () => {
  it('should authen and return user', async () => {
    // stub
    global.NAP = {}
    NAP.Authen = {
      findOneAndUpdate: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({ _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
      )
    }

    const { willAuthen } = require('../AuthenResolver')
    const installationId = 'FOO_INSTALLATION_ID'
    const userObject = { id: 'FOO_USER_ID' }
    const provider = 'facebook'

    const user = await willAuthen(installationId, userObject, provider)

    expect(user).toMatchSnapshot()
  })

  it('should able to login with Facebook', async () => {
    const userData = {
      _id: '58d0e20e7ff032b39c2a9a18',
      role: 'user',
    }

    const context = { 
      headers : { host: 'localhost:3000'},
      nap : {
        willLoginWithFacebook: async () => userData,
        willCreateUser: async () => userData,
        willInstallAndAuthen: async () => userData,
      }
    }

    const accessToken = 'FACEBOOK_ACCESS_TOKEN'
    const args = { accessToken }

    const { loginWithFacebook } = require('../AuthenResolver')
    const user = await loginWithFacebook({ context, args })    
    expect(user).toMatchSnapshot()
  })

  it('should able to login', async () => {
    const userData = {
      _id: '58d0e20e7ff032b39c2a9a18',
      role: 'user',
    }

    const context = { 
      headers : { host: 'localhost:3000'},
      nap : {
        willLogin: async () => userData,
        willInstallAndAuthen: async () => userData,
      }
    }
    const email = 'foo@bar.com'
    const password = 'password'
    const args = { email, password }

    const { login } = require('../AuthenResolver')
    const user = await login({ context, args })    
    expect(user).toMatchSnapshot()
  })

  it('should able to signup', async () => {
    const userData = {
      _id: '58d0e20e7ff032b39c2a9a18',
      role: 'user',
    }

    const context = { 
      headers : { host: 'localhost:3000'},
      nap : {
        willSignUp: async () => userData,
        willCreateUser: async () => userData,
        willInstallAndAuthen: async () => userData,
      }
    }
    const email = 'foo@bar.com'
    const password = 'password'
    const args = { email, password }

    // stub
    global.NAP = {}

    const { signup } = require('../AuthenResolver')
    const user = await signup({ context, args })    
    expect(user).toMatchSnapshot()
  })

  it('should able to logout', async () => {
    const authenData = {
      isLoggedIn: false,
      sessionToken: null
    }

    const context = { 
      logout:() => {},
      session: {
        destroy:() => {}
      },
      nap : {
        willLogout: async () => authenData,
        session: authenData
      },
      token: 'SESSION_TOKEN'
    }

    const { logout } = require('../AuthenResolver')
    const user = await logout({ context })    
    expect(user).toMatchSnapshot()
  })
})