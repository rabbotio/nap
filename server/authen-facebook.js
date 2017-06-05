const { guard, onError } = require('./errors')

// Valid accessToken?
const willLoginWithFacebook = async (req, accessToken) => {
  // Guard
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    throw new Error('Required : FACEBOOK_APP_ID, FACEBOOK_APP_SECRET')
  }

  // Guard
  guard({ accessToken })

  // To let passport-facebook-token consume
  req.body.access_token = accessToken

  // Validate facebook token
  const { willAuthenWithPassport } = require('./passport-authen')
  return await willAuthenWithPassport('facebook-token', req).catch(onError(req))
}

module.exports = {
  willLoginWithFacebook
}
