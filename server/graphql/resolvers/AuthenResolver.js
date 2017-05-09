const loginWithFacebook = ({ context, args }) => new Promise(async (resolve) => {
  const onError = err => {
    context.nap.errors.push({ code: 403, message: err.message })
    return resolve(null)
  }

  const userData = await context.nap.willLoginWithFacebook(context, args.accessToken).catch(onError)
  if (!userData) {
    return onError(new Error('Authen error'))
  }

  const user = await context.nap.willCreateUser(userData).catch(onError)
  if (!user) {
    return onError(new Error('Authen error'))
  }

  const installation = await context.nap.willInstall(args).catch(onError)
  const authen = await context.nap.willAuthen(installation.id, user, 'facebook').catch(onError)

  if (!authen) {
    return onError(new Error('Authen error'))
  }

  return resolve(authen)
})

const signup = ({ context, args }) => new Promise(async (resolve) => {
  // Error
  const onError = err => {
    context.nap.errors.push({ code: 403, message: err.message })
    resolve(null)
  }

  // Installation
  const user = await context.nap.willSignUp(context, args.email, args.password).then(context.nap.willCreateUser).catch(onError)

  // Succeed
  resolve(user)
})

const forget = ({ context, args }) => new Promise(async (resolve) => {
  // Error
  const onError = err => {
    context.nap.errors.push({ code: 403, message: err.message })
    return resolve(null)
  }

  // Installation
  const user = await context.nap.willResetPassword(context, args.email).catch(onError)

  // Succeed
  return resolve({
    user: {
      status: user.status
    }
  })
})

const login = ({ context, args }) => new Promise(async (resolve) => {
  // Error
  const onError = err => {
    context.nap.errors.push({ code: 403, message: err.message })
    return resolve(null)
  }

  // User
  const user = await context.nap.willLogin(context, args.email, args.password).catch(onError)

  // Guard
  if (!user) {
    return onError(new Error('Authen error'))
  }

  // Link
  const installation = await context.nap.willInstall(args).catch(onError)
  const authen = await context.nap.willAuthen(installation.id, user, 'local').catch(onError)

  // Fail
  if (!authen) {
    return onError(new Error('Authen error'))
  }

  // Succeed
  return resolve(authen)
})

const logout = ({ context }) => new Promise(async (resolve, reject) => {
  // Logout from cookie
  context.logout()

  // Guard
  if (!context.nap.currentUser) {
    context.nap.errors.push({ code: 403, message: 'No session found' })
    return resolve(null)
  }

  // Logout
  const authen = await context.nap.willLogout(context.nap.currentUser.installationId, context.nap.currentUser.userId, context.token)

  // Fail
  if (!authen) {
    return reject(new Error('No session found'))
  }

  // Succeed
  return resolve(authen)
})

const authen = ({ context }) => new Promise(async (resolve) => {
  const _noAuthen = {
    isLoggedIn: false,
    sessionToken: null
  }

  // Guard
  if (!context.nap.currentUser) {
    return resolve(_noAuthen)
  }

  NAP.Authen.findOne({
    userId: context.nap.currentUser.userId, installationId: context.nap.currentUser.installationId
  },
    (err, result) => err ? resolve(_noAuthen) : resolve(result)
  )
})

module.exports = { loginWithFacebook, signup, forget, login, logout, authen }
