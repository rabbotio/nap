const willSendVerification = (email, verification_url) => new Promise((resolve, reject) => {

  // Guard
  if (!NAP.Config.mailgun_api_key) {
    throw ('Required MAILGUN_API_KEY, MAILGUN_DOMAIN')
  }

  // TODO : Custom mail vendor from external
  const MailGun = require('mailgun-js')
  const mailgun = new MailGun({
    mailgun_api_key: NAP.Config.mailgun_api_key,
    mailgun_domain: NAP.Config.mailgun_domain
  })

  const data = {
    from: 'noreply@' + NAP.Config.MAILGUN_DOMAIN,
    to: email,
    subject: 'Hello from Mailgun',
    text: 'Use the link below to sign in:\n\n' + verification_url + '\n\n'
  }

  mailgun.messages().send(data, (err, body) => {
    if (err) {
      debug.error('Error sending email to ' + email, err)
      reject(err)
    } else {
      resolve(body)
    }
  })
})

module.exports = { willSendVerification }