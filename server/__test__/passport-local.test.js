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
})
