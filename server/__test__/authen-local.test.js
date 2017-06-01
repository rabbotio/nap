/* eslint-env jest */

describe('authen-local', () => {
  it('should throw error if has no email and password', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = null
    const password = null

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error if has no email', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = null
    const password = 'foobar'

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error if has no password', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = 'katopz@gmail.com'
    const password = null

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : password')
    })
  })
  
  it('should login with user and password', async () => {
    // mock
    const req = {
      nap: { errors : [] },
      body: {}
    }
    const email = 'katopz@gmail.com'
    const password = 'foobar'

    const { willLogin } = require('../authen-local')
    const user = await willLogin(req, email, password)
    expect(user).toMatchSnapshot()
  })

  it('should logout', async () => {
    // stub
    global.NAP = {}
    NAP.Authen = {
      findOneAndUpdate: jest.fn().mockImplementationOnce(() => Promise.resolve({
        loggedOutAt: '2017-06-01T06:22:01.596Z',
        isLoggedIn: false,
        sessionToken: null
      }))
    }

    // mock
    const { createSessionToken} = require('../jwt-token')
    const installationId = '58d119431e2107009b2cad55'
    const userId = '58d0e20e7ff032b39c2a9a18'
    const sessionToken = createSessionToken(installationId, userId)

    const { willLogout } = require('../authen-local')
    const result = await willLogout(installationId, userId, sessionToken)
    expect(result).toMatchSnapshot()
  })

  it('should reset password', async () => {
    // mock
    const req = { headers : { host: 'localhost:3000'} }
    const email = 'foo@bar.com'
    const token = 'aa90f9ca-ced9-4cad-b4a2-948006bf000d'

    // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => Promise.resolve({
        save: () => Promise.resolve({
          _id: '592c0bb4484d740e0e73798b',
          role: 'user',
          email,
          token
        })
      }))
    }

    const { willResetPassword } = require('../authen-local')
    const result = await willResetPassword(req, email)    
    expect(result).toMatchSnapshot()
  })

  it('should able to signup', async () => {
    // mock
    const req = { headers : { host: 'localhost:3000'} }
    const email = 'foo@bar.com'
    const password = 'password'

    // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => null),
      create: jest.fn().mockImplementationOnce(() => Promise.resolve({
        _id: '592c0bb4484d740e0e73798b',
        role: 'user',
      }))
    }

    const { willSignUp } = require('../authen-local')
    const result = await willSignUp(req, email, password)    
    expect(result).toMatchSnapshot()
  })
})