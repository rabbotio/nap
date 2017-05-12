const { onError } = require('../../errors')

const willCreateUser = userData => new Promise((resolve, reject) => {
  userData = Object.assign(userData, { role: 'user' })
  NAP.User.create(userData, (err, result) => err ? reject(err) : resolve(result))
})

const willReadUser = async ({ context }) => {
  // Guard
  if (!context.nap.session) {
    return onError('No session found')
  }

  const user = await new Promise((resolve, reject) =>
    NAP.User.findById(context.nap.session.userId,
      (err, result) => err ? reject(err) : resolve(result)))

  // Fail
  if (!user) {
    return onError('User not exist') && null
  }

  // Succeed
  return user
}

const unlinkFacebook = async ({ context }) => {
  const user = await NAP.User.findById(context.nap.session.userId)
  if (!user) {
    throw new Error('Authen error')
  }

  if (user.facebook) {
    user.facebook.isUnlink = true
  }

  await user.save()
  return user
}

const linkFacebook = async ({ args, context }) => {
  const user = await NAP.User.findById(context.nap.session.userId)
  if (!user) {
    throw new Error('Authen error')
  }

  const userData = await context.nap.willLoginWithFacebook(context, args.accessToken)
  user.facebook = userData.facebook

  await user.save()
  return user
}

const changeEmail = async ({ args, context }) => {
  const user = await NAP.User.findById(context.nap.session.userId)
  if (!user) {
    throw new Error('Authen error')
  }

  // Guard
  const is = require('is_js')
  if (is.not.email(args.email)) {
    throw new Error('email format not valid')
  }

  user.email = args.email

  await user.save()
  return user
}

module.exports = { willCreateUser, user: willReadUser, linkFacebook, unlinkFacebook, changeEmail }
