const config = require('./config');

const willSendVerification = (email, verification_url) => new Promise((resolve, reject) => {
  // Guard
  if (!config.mailgun_api_key || !config.mailgun_domain) {
    throw 'Required MAILGUN_API_KEY, MAILGUN_DOMAIN'
  }

  // Guard
  if (!verification_url) {
    return reject(new Error('No verification URL'))
  }

  // Client
  const MailGun = require('mailgun.js')
  const mailgunClient = MailGun.client({
    username: 'api',
    key: config.mailgun_api_key
  })

  // Template
  const builder = require('../templates/email-signin')
  const data = builder(config.mailgun_domain, email, verification_url)

  // Send
  return mailgunClient.messages
    .create(config.mailgun_domain, data)
    .then(resolve).catch(reject)
})

const willSendPasswordReset = (email, password_reset_url, new_password_reset_url) => new Promise((resolve, reject) => {
  // Guard
  if (!config.mailgun_api_key || !config.mailgun_domain) {
    throw 'Required MAILGUN_API_KEY, MAILGUN_DOMAIN'
  }

  // Guard
  if (!password_reset_url) {
    return reject(new Error('No password reset URL'))
  }

  // Guard
  if (!new_password_reset_url) {
    return reject(new Error('No new password reset URL'))
  }

  // Client
  const MailGun = require('mailgun.js')
  const mailgunClient = MailGun.client({
    username: 'api',
    key: config.mailgun_api_key
  })

  // Template
  const builder = require('../templates/email-forget')
  const data = builder(config.mailgun_domain, email, password_reset_url, new_password_reset_url)

  // Send
  return mailgunClient.messages
    .create(config.mailgun_domain, data)
    .then(resolve).catch(reject)
})

module.exports = { willSendVerification, willSendPasswordReset }