// User will receive this email to reset password
// @see https://github.com/mailgun/mailgun-js#messages
module.exports = (domain, email, password_reset_url, new_password_reset_url) => ({
  from: 'noreply@' + domain,
  to: [email],
  subject: `[${domain}] Please reset your password`,
  text: `We heard that you lost your ${domain} password. Sorry about that!

But don’t worry! You can use the following link within the next day to reset your password:

${password_reset_url}

If you don’t use this link within 24 hours, it will expire.
To get a new password reset link, visit ${new_password_reset_url}

Thanks,`
})