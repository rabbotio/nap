/* eslint-env jest */

process.env.MAILGUN_API_KEY = 'FOO_MAILGUN_API_KEY'
process.env.MAILGUN_DOMAIN = 'BAR_MAILGUN_DOMAIN'

const config = require('../config')

describe('mailer', () => {
  it('should return error if no API_KEY or DOMAIN provide while verification', async () => {
    const { willSendVerification } = require('../mailer')
    await willSendVerification({}).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return error if no API_KEY or DOMAIN provide while reset password', async () => {
    const { willSendPasswordReset } = require('../mailer')
    await willSendPasswordReset({}).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return verification mail body', async () => {
    const { createVerificationURL } = require('../passport-local')
    const email = 'katopz@gmail.com'
    const base_url = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const verification_url = createVerificationURL(base_url, token)

    const { willSendVerification } = require('../mailer')
    const payload = await willSendVerification({
      mailgun_api_key: config.mailgun_api_key,
      mailgun_domain: config.mailgun_domain,
      email,
      verification_url
    })

    expect(payload).toMatchSnapshot()
  })

  it('should return reset mail body', async () => {
    const { createPasswordResetURL, createNewPasswordResetURL } = require('../passport-local')
    const email = 'katopz@gmail.com'
    const base_url = 'http://localhost:3000'
    const token = 'FOO_TOKEN'
    const password_reset_url = createPasswordResetURL(base_url, token)
    const new_password_reset_url = createNewPasswordResetURL(base_url)

    const mailer = require('../mailer')
    const msg = await mailer.willSendPasswordReset({
      mailgun_api_key: config.mailgun_api_key,
      mailgun_domain: config.mailgun_domain,
      email,
      password_reset_url,
      new_password_reset_url
    })

    expect(msg).toMatchSnapshot()
  })
})