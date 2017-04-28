/* eslint-env jest */

require('../config')

describe('mailer', () => {
  it('should return error if no API_KEY or DOMAIN provide while verification', async () => {
    const { willSendVerification } = require('../mailer')
    await willSendVerification(null, null).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return verification mail body', async () => {
    const { createVerificationURL } = require('../passport-local')
    const email = 'katopz@gmail.com'
    const verificationURL = createVerificationURL('http://localhost:3000', 'token')

    const { willSendVerification } = require('../mailer')
    const payload = await willSendVerification(email, verificationURL)
    expect(payload).toMatchSnapshot()
  })

  it('should return error if no API_KEY or DOMAIN provide while reset password', async () => {
    const { willSendPasswordReset } = require('../mailer')
    await willSendPasswordReset(null, null).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })
})