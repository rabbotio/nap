const willCreateUser = userData => new Promise((resolve, reject) => {
  userData = Object.assign(userData, { role: 'user' })
  NAP.User.create(userData, (err, result) => err ? reject(err) : resolve(result))
})

const willReadUser = ({ context }) => new Promise(async (resolve, reject) => {
  // Guard
  if (!context.nap.currentUser) {
    return reject(new Error('No session found'))
  }

  // Error
  const onError = err => {
    context.nap.errors.push({ code: 403, message: err.message })
    resolve(null)
  }

  const user = await new Promise((resolve, reject) => NAP.User.findById(context.nap.currentUser.userId, (err, result) => err ? reject(err) : resolve(result)))
  // Fail
  if (!user) {
    return onError(new Error('User not exist'))
  }

  // Succeed
  return resolve(user)
})

const unlinkFacebook = async ({ context }) => {
  const user = await NAP.User.findById(context.nap.currentUser.userId)
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
  const user = await NAP.User.findById(context.nap.currentUser.userId)
  if (!user) {
    throw new Error('Authen error')
  }

  const userData = await context.nap.willLoginWithFacebook(context, args.accessToken)
  user.facebook = userData.facebook

  await user.save()
  return user
}

const changeEmail = async ({ args, context }) => {
  const user = await NAP.User.findById(context.nap.currentUser.userId)
  if (!user) {
    throw new Error('Authen error')
  }

  const isEmail = require('validator/lib/isEmail')
  if (!isEmail(args.email)) {
    throw new Error('email format not validated')
  }

  user.email = args.email

  await user.save()
  return user
}

module.exports = { willCreateUser, user: willReadUser, linkFacebook, unlinkFacebook, changeEmail }
