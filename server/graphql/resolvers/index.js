const willInstallAndAuthen = async (context, args, user, provider) => {
  // Guard
  if (!user) {
    throw new Error('Authen error')
  }

  // Link
  const { willInstall } = require('./InstallationResolver')
  const { willAuthen } = require('./AuthenResolver')
  const installation = await willInstall(args)
  const authen = await willAuthen(installation.id, user, provider)

  // Failed
  if (!authen) {
    throw new Error('Authen error')
  }

  // Succeed
  return authen
}

module.exports = {
  willInstallAndAuthen
}
