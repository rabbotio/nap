/* eslint-env jest */

const MailGun = jest.genMockFromModule('mailgun-js');

MailGun.prototype.messages = () => ({
  send: (_, callback) => callback(null, 'FOO_MAILGUN_BODY' )
})

module.exports = MailGun