const willSendVerification = (email, verification_url) => new Promise(resolve => {

  // Guard
  if (!NAP.Config.mailgun_api_key || !NAP.Config.mailgun_api_key) {
    throw 'Required MAILGUN_API_KEY, MAILGUN_DOMAIN'
  }

  // Client
  const MailGun = require('mailgun.js')
  const mailgunClient = MailGun.client({
    username: 'api',
    key: NAP.Config.mailgun_api_key
  })

  // Template
  const builder = require('../templates/email-register')
  const data = builder(email, verification_url)

  // Send
  return mailgunClient.messages
    .create(NAP.Config.mailgun_domain, data)
    .then(msg => resolve(msg))
})

module.exports = { willSendVerification }