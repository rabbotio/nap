const { onError } = require('../../errors')

// Guard
const _getUserIdFromSession = (context) => context.nap.session ? context.nap.session.userId : null
const _willGetUserFromSession = async (context) => {
  const userId = _getUserIdFromSession(context)

  // Guard
  if(!userId) {
    throw new Error('No session found')
  }

  return await NAP.User.findById(userId).catch(onError(context))
}

const willCreateUser = async (user) => await NAP.User.create(Object.assign(user, { role: 'user' }))
const willReadUser = async ({ context }) => await _willGetUserFromSession(context)

// TODO : Other provider
const unlinkFacebook = async ({ context }) => {
  const user = await _willGetUserFromSession(context)

  // Guard
  if (user && user.facebook) {
    // TOFIX : use opt-in isLink
    user.facebook.isUnlink = true
    await user.save()
  }

  return user
}

const linkFacebook = async ({ args, context }) => {
  const user = await _willGetUserFromSession(context)
  const authenUser = await context.nap.willLoginWithFacebook(context, args.accessToken)

  // Guard
  if (authenUser && authenUser.facebook) {
    user.facebook = authenUser.facebook
    user.facebook.isUnlink = false
    await user.save()
  }

  return user
}

const changeEmail = async ({ args, context }) => {
  const user = await _willGetUserFromSession(context)

  // Guard
  const is = require('is_js')
  if (is.not.email(args.email)) {
    throw new Error('email format not valid')
  }

  if (user) {
    user.email = args.email
    await user.save()
  }

  return user
}

const forget = async ({ context, args }) =>
  await context.nap
    .willResetPassword(context, args.email)
    .catch(onError(context))

module.exports = { willCreateUser, user: willReadUser, linkFacebook, unlinkFacebook, changeEmail, forget }
