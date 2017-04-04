module.exports = (models) => {
  models.AuthenTC.addRelation(
    'user',
    () => ({
      resolver: models.UserTC.getResolver('findOne'),
      args: {
        filter: (source) => ({ userId: source.userId }),
        skip: null,
        sort: null,
      },
      projection: { userId: true },
    })
  )

  models.AuthenTC.addRelation(
    'installation',
    () => ({
      resolver: models.InstallationTC.getResolver('findOne'),
      args: {
        filter: (source) => ({ userId: source.installationId }),
        skip: null,
        sort: null,
      },
      projection: { installationId: true },
    })
  )

  models.AuthenTC.addResolver({
    name: 'loginWithFacebook',
    kind: 'mutation',
    args: {
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      accessToken: 'String'
    },
    type: models.AuthenTC,
    resolve: ({ context, args }) => new Promise(async (resolve) => {
      const onError = err => {
        context.nap.errors.push({ code: 403, message: err.message })
        resolve(null)
      }
      const installation = await models.willInstall(args).catch(onError)
      const user = await context.nap.willLoginWithFacebook(context, args.accessToken).then(models.createUser).catch(onError)
      const authen = await context.nap.willAuthen(installation.id, user.id, 'facebook').catch(onError)

      if (!authen) {
        onError(new Error('Authen error'))
        return
      }

      resolve(authen)
    })
  })

  models.AuthenTC.addResolver({
    name: 'loginWithEmail',
    kind: 'mutation',
    args: {
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      email: 'String'
    },
    type: models.AuthenTC,
    resolve: ({ context, args }) => new Promise(async (resolve) => {
      const onError = err => {
        context.nap.errors.push({ code: 403, message: err.message })
        resolve(null)
      }
      const installation = await models.willInstall(args).catch(onError)
      const user = await context.nap.willLoginWithEmail(context, args.email).then(models.createUser).catch(onError)
      const authen = await context.nap.willAuthen(installation.id, user.id, 'email').catch(onError)

      if (!authen) {
        onError(new Error('Authen error'))
        return
      }
      resolve(authen)
    })
  })

  const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
    models.Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
      loggedOutAt: new Date().toISOString(),
      isLoggedIn: false
    }, { new: true, upsert: false }, (err, result) => {
      // Error?
      err && debug.error(err) && reject(err)
      // Succeed
      resolve(result)
    })
  })

  models.AuthenTC.addResolver({
    name: 'logout',
    kind: 'mutation',
    type: models.AuthenTC,
    resolve: ({ context }) => new Promise(async (resolve, reject) => {
      context.logout()
      if (!context.nap.currentUser) {
        reject(new Error('No session found'))
        return
      }
  
      const authen = await willLogout(context.nap.currentUser.installationId, context.nap.currentUser.userId, context.token)
      if (!authen) {
        reject(new Error('No session found'))
        return
      }
      resolve(authen)
    })
  })
}
