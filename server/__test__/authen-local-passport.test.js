/* eslint-env jest */
describe('authen-local-passport', () => {
  it('should create email verification url', async () => {
    const { createVerificationURL } = require('../authen-local-passport')
    const base_url = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const verification_url = createVerificationURL(base_url, token)
    expect(verification_url).toMatchSnapshot()
  })

  it('should create password reset url', async () => {
    const { createPasswordResetURL } = require('../authen-local-passport')
    const base_url = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const password_reset_url = createPasswordResetURL(base_url, token)
    expect(password_reset_url).toMatchSnapshot()
  })

  it('should create new password reset url', async () => {
    const { createNewPasswordResetURL } = require('../authen-local-passport')
    const base_url = 'http://localhost:3000'
    const new_password_reset_url = createNewPasswordResetURL(base_url)
    expect(new_password_reset_url).toMatchSnapshot()
  })

  it('should throw error for empty email', async () => {
    const { willValidateEmail } = require('../authen-local-passport')
    await willValidateEmail().catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error for invalid email', async () => {
    const { willValidateEmail } = require('../authen-local-passport')
    await willValidateEmail('').catch(err => {
      expect(() => { throw err }).toThrow('Invalid email')
    })
  })

  it('should be true for valid email', async () => {
    const { willValidateEmail } = require('../authen-local-passport')
    expect(await willValidateEmail('foo@bar.com')).toMatchSnapshot()
  })

  it('should throw error for empty password', async () => {
    const { willValidatePassword } = require('../authen-local-passport')
    await willValidatePassword().catch(err => {
      expect(() => { throw err }).toThrow('Required : password')
    })
  })

  it('should throw error for invalid password', async () => {
    const { willValidatePassword } = require('../authen-local-passport')
    const { PASSWORD_LENGTH_ERROR } = require('../errors')
    await willValidatePassword('foo').catch(err => {
      expect(() => { throw err }).toThrow(PASSWORD_LENGTH_ERROR.message)
    })
  })

  it('should be true for valid password', async () => {
    const { willValidatePassword } = require('../authen-local-passport')
    expect(await willValidatePassword('foofoobarbar')).toMatchSnapshot()
  })

  it('should be true for valid email and password', async () => {
    const { willValidateEmailAndPassword } = require('../authen-local-passport')
    expect(await willValidateEmailAndPassword('foo@bar.com', 'foofoobarbar')).toMatchSnapshot()
  })

  it('should throw error if email already exist when signup new user', async () => {
    // mock
    const userData = { foo: 'bar' }

    // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() =>
        Promise.resolve(Object.assign(
          {
            _id: '592c0bb4484d740e0e73798b',
            role: 'user'
          },
          userData
        ))
      )
    }
    
    const { willSignUpNewUser } = require('../authen-local-passport')
    const token = require('uuid/v4')()
    const { EMAIL_ALREADY_USE_ERROR } = require('../errors')

    await willSignUpNewUser('foo@bar.com', 'foofoobarbar', token).catch(err => {
      expect(() => { throw err }).toThrow(EMAIL_ALREADY_USE_ERROR)
    })
  })

  it('should signup new user and return user data', async () => {
    // mock
    const userData = { foo: 'bar' }

    // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => null),      
      create: jest.fn().mockImplementationOnce(() =>
        Promise.resolve(Object.assign(
          {
            _id: '592c0bb4484d740e0e73798b',
            role: 'user'
          },
          userData
        ))
      )
    }

    const { willSignUpNewUser } = require('../authen-local-passport')
    const token = require('uuid/v4')()
    expect(await willSignUpNewUser('foo@bar.com', 'foofoobarbar', token)).toMatchSnapshot()
  })

  it('should reset password if user exist', async () => {
    // mock
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
      })),
      findOneAndUpdate: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          _id: '592c0bb4484d740e0e73798b',
          role: 'user',
          email,
          token
        })
      )
    }

    const { willResetPasswordExistingUser } = require('../authen-local-passport')
    expect(await willResetPasswordExistingUser(email, token)).toMatchSnapshot()
  })

  it('should redirect null token to /auth/error/token-not-provided', async () => {
    const { auth_local_token } = require('../authen-local-passport').handler
    const req = { params: { token: null } }
    const res = {
      redirect: (route) => expect(route).toMatchSnapshot()
    }
    auth_local_token(req, res)
  })

  it('should redirect non exist token to /auth/error/token-not-exist', async () => {
    // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => Promise.resolve(null))
    }

    const { auth_local_token } = require('../authen-local-passport').handler
    const req = { params: { token: 'NOT_EXIST_TOKEN' } }
    const res = {
      redirect: (route) => expect(route).toMatchSnapshot()
    }

    auth_local_token(req, res)
  })

  it('should reset password by token', async () => {
    const token = 'aa90f9ca-ced9-4cad-b4a2-948006bf000d'
    const password = 'password'

   // stub
    global.NAP = {}
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => Promise.resolve({
        save: () => Promise.resolve({
          _id: '592c0bb4484d740e0e73798b',
          role: 'user',
          token
        })
      }))
    }
    
    const { reset_password_by_token } = require('../authen-local-passport').handler
    const req = { body: { token, password} }
    const res = {
      redirect: (route) => expect(route).toMatchSnapshot(),
      json: JSON.toString
    }
    reset_password_by_token(req, res)
  })

  it('should redirect valid token to /auth/verified', async () => {
    // stub
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => Promise.resolve({
        save: () => Promise.resolve({
          _id: '592c0bb4484d740e0e73798b',
          role: 'user',
          status: 'VERIFIED_BY_EMAIL'
        })
      }))
    }

    const { auth_local_token } = require('../authen-local-passport').handler
    const req = { params: { token: 'VALID_TOKEN' } }
    const res = {
      redirect: (route) => expect(route).toMatchSnapshot()
    }
    auth_local_token(req, res)
  })

  it('should validate local strategy', async () => {
    // mock
    const email = 'foo@bar.com'
    const password = 'password'
    const hashed_password = '$2a$10$J8sNyptEzgDuQu3b9H8PnuYO85KLnMYF2RjmMeAbt.vpND7NymH/O'

    // stub
    NAP.User = {
      findOne: jest.fn().mockImplementationOnce(() => Promise.resolve({
        _id: '592c0bb4484d740e0e73798b',
        role: 'user',
        verified: true,
        hashed_password
      }))
    }

    const { validateLocalStrategy } = require('../authen-local-passport')
    validateLocalStrategy(email, password, (err, result) => expect(result).toMatchSnapshot())
  })
})
