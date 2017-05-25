/* eslint-env jest */

const config = require('../config')

describe('passport-local', () => {
  it('should throw error for empty email', async () => {
    const { willValidateEmail } = require('../passport-local')
    await willValidateEmail('').catch(err => {
      expect(() => { throw err }).toThrow('Invalid email')
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
})
