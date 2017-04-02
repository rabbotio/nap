/* eslint-env jest */
describe('mailer', () => {
  it('should return error if no API_KEY or DOMAIN provide', async () => {
    const { willSendVerification } = require('../mailer')
    await willSendVerification(null, null).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })
})