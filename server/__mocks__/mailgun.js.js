/* eslint-env jest */

const MailGun = jest.genMockFromModule('mailgun.js');

MailGun.client = ({ username, key }) => {
  // Guard
  if( !username || !key) {
    throw 'Required : username, key'
  }

  // Good
  return {
    messages: {
      create: () => Promise.resolve('FOO_MAILGUN_BODY')
    }
  }
}

module.exports = MailGun