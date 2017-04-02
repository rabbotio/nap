module.exports = (email, verification_url) => ({
  from: 'noreply@' + NAP.Config.MAILGUN_DOMAIN,
  to: [email],
  subject: 'Hello from Mailgun',
  text: 'Use the link below to sign in:\n\n' + verification_url + '\n\n'
})