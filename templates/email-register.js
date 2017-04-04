const config = require('../server/config');

// Will send this to sign in with email user via MailGun
// @see https://github.com/mailgun/mailgun-js#messages
module.exports = (email, verification_url) => ({
  from: 'noreply@' + config.MAILGUN_DOMAIN,
  to: [email],
  subject: 'Hello from Mailgun',
  text: 'Use the link below to sign in:\n\n' + verification_url + '\n\n'
})