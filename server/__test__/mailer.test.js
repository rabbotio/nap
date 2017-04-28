/* eslint-env jest */

process.env.MAILGUN_API_KEY = 'FOO_MAILGUN_API_KEY'
process.env.MAILGUN_DOMAIN = 'BAR_MAILGUN_DOMAIN'

require('../config')

describe('mailer', () => {
  it('should return error if no API_KEY or DOMAIN provide while verification', async () => {
    const { willSendVerification } = require('../mailer')
    await willSendVerification(null, null).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return error if no API_KEY or DOMAIN provide while reset password', async () => {
    const { willSendPasswordReset } = require('../mailer')
    await willSendPasswordReset(null, null).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return verification mail body', async () => {
    const { createVerificationURL } = require('../passport-local')
    const email = 'katopz@gmail.com'
    const baseURL = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const verificationURL = createVerificationURL(baseURL, token)

    const { willSendVerification } = require('../mailer')
    const payload = await willSendVerification(email, verificationURL)

    expect(payload).toMatchSnapshot()
  })

  it('should return reset mail body', async () => {
    const { createPasswordResetURL, createNewPasswordResetURL } = require('../passport-local')
    const email = 'katopz@gmail.com'
    const baseURL = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const passwordResetURL = createPasswordResetURL(baseURL, token)
    const newPasswordResetURL = createNewPasswordResetURL(baseURL)

    const mailer = require('../mailer')
    const msg = await mailer.willSendPasswordReset(email, passwordResetURL, newPasswordResetURL)

    expect(msg).toMatchSnapshot()
  })
})