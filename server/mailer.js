const sendVerification = (email, verification_url) => {
    debug.info('Send verification url :', verification_url)
    // Guard
    if(!NAP.Config.apiKey){
      throw ('Required MAILGUN_API_KEY, MAILGUN_DOMAIN')
    }

    // TODO : Custom from external
    const Mailgun = require('mailgun-js')
    const mailgun = new Mailgun({
      apiKey: NAP.Config.apiKey,
      domain: NAP.Config.domain
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
      } else {
        debug.info('MailGun :', body)
      }
    })
}

module.exports = { sendVerification }