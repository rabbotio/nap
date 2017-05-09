// Error, TODO : Use NAP.Error
const onError = (context) => (err) => {
  context.nap.errors.push({ code: 403, message: err.message })
}

const loginWithFacebook = async ({ context, args }) => {
  const userData = await context.nap.willLoginWithFacebook(context, args.accessToken).catch(onError(context))
  const user = userData && await context.nap.willCreateUser(userData).catch(onError(context))
  return user && await context.nap.willInstallAndAuthen(context, args, user, 'facebook').catch(onError(context))
}

const login = async ({ context, args }) => {
  const user = await context.nap.willLogin(context, args.email, args.password).catch(onError(context))
  return user && await context.nap.willInstallAndAuthen(context, args, user, 'local').catch(onError(context))
}

const signup = async ({ context, args }) => {
  const userData = await context.nap.willSignUp(context, args.email, args.password).catch(onError(context))
  const user = userData && await context.nap.willCreateUser(userData).catch(onError(context))
  return user
}

const forget = async ({ context, args }) => await context.nap.willResetPassword(context, args.email)
  .then(user => ({ user: { status: user.status } }))
  .catch(onError(context))

const logout = async ({ context }) => {
  // Logout from cookie
  context.logout()

  // Guard
  if (!context.nap.session) {
    return onError(context)(new Error('No session found'))
  }

  // Logout
  const { installationId, userId } = context.nap.session
  return await context.nap.willLogout(installationId, userId, context.token).catch(onError(context))
}

const authen = async ({ context }) => {
  const _noAuthen = {
    isLoggedIn: false,
    sessionToken: null
  }

  // Guard
  if (!context.nap.session) {
    return _noAuthen
  }

  return await new Promise((resolve, reject) => {
    const { installationId, userId } = context.nap.session
    NAP.Authen.findOne({ userId, installationId }, (err, result) =>
      err ? reject(_noAuthen) : resolve(result))
  })
}

const willAuthen = async (installationId, { _id: userId, verified }, provider) => {
  // Base data
  let authenData = {
    isLoggedIn: false,
    installationId,
    userId
  }

  // Create session token  
  const { createSessionToken } = require('../../jwt-token')
  const sessionToken = createSessionToken(installationId, userId)

  // Guard by user local verification if has
  const isVerified = (provider === 'local') ? verified : true
  if (isVerified) {
    authenData = Object.assign(authenData, {
      isLoggedIn: isVerified,
      loggedInAt: new Date().toISOString(),
      loggedInWith: provider,
      sessionToken
    })
  }

  // Allow to authen
  return new Promise((resolve, reject) => {
    NAP.Authen.findOneAndUpdate(
      { installationId, userId },
      authenData,
      { new: true, upsert: true },
      (err, result) => err ? reject(err) : resolve(result)
    )
  })
}

module.exports = {
  loginWithFacebook,
  signup,
  forget,
  login,
  logout,
  authen,
  willAuthen
}
