// User will receive this email after `sign in` for verification
// @see https://github.com/mailgun/mailgun-js#messages
module.exports = (domain, email, verification_url) => ({
  from: 'noreply@' + domain,
  to: [email],
  subject: `[${domain}] Please verify your email address.`,
  text: `Hi!

Help us secure your ${domain} account by verifying your email address (${email}).
This lets you access all of ${domain}'s features.

Please visit : ${verification_url}

You’re receiving this email because you recently created a new ${domain} account or added a new email address. If this wasn’t you, please ignore this email.`
})