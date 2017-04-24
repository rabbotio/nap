// Will send this to sign in with email user via MailGun
// @see https://github.com/mailgun/mailgun-js#messages
module.exports = (domain, email, verification_url) => ({
  from: 'noreply@' + domain,
  to: [email],
  subject: 'Hello from Mailgun',
  text: 'Use the link below to sign in:\n\n' + verification_url + '\n\n'
})