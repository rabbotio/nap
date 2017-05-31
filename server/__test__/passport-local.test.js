/* eslint-env jest */

const config = require('../config')

describe('passport-local', () => {
  it('should throw error for empty email', async () => {
    const { willValidateEmail } = require('../passport-local')
    await willValidateEmail().catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error for invalid email', async () => {
    const { willValidateEmail } = require('../passport-local')
    await willValidateEmail('').catch(err => {
      expect(() => { throw err }).toThrow('Invalid email')
    })
  })

  it('should be true for valid email', async () => {
    const { willValidateEmail } = require('../passport-local')
    expect(await willValidateEmail('foo@bar.com')).toMatchSnapshot()
  })

  it('should throw error for empty password', async () => {
    const { willValidatePassword } = require('../passport-local')
    await willValidatePassword().catch(err => {
      expect(() => { throw err }).toThrow('Required : password')
    })
  })

  it('should throw error for invalid password', async () => {
    const { willValidatePassword } = require('../passport-local')
    const { PASSWORD_LENGTH_ERROR } = require('../errors')
    await willValidatePassword('foo').catch(err => {
      expect(() => { throw err }).toThrow(PASSWORD_LENGTH_ERROR.message)
    })
  })

  it('should be true for valid password', async () => {
    const { willValidatePassword } = require('../passport-local')
    expect(await willValidatePassword('foofoobarbar')).toMatchSnapshot()
  })

  it('should be true for valid email and password', async () => {
    const { willValidateEmailAndPassword } = require('../passport-local')
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
    
    const { willSignUpNewUser } = require('../passport-local')
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

    const { willSignUpNewUser } = require('../passport-local')
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
      }))
    }

    const { willResetPasswordExistingUser } = require('../passport-local')
    expect(await willResetPasswordExistingUser(email, token)).toMatchSnapshot()
  })
})
