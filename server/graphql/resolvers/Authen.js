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
        return resolve(null)
      }
      const user = await context.nap.willLoginWithFacebook(context, args.accessToken).then(models.createUser).catch(onError)
      if (!user) {
        return onError(new Error('Authen error'))
      }
      
      const installation = await models.willInstall(args).catch(onError)
      const authen = await context.nap.willAuthen(installation.id, user, 'facebook').catch(onError)

      if (!authen) {
        onError(new Error('Authen error'))
        return
      }

      return resolve(authen)
    })
  })

  models.AuthenTC.addResolver({
    name: 'signup',
    kind: 'mutation',
    args: {
      email: 'String',
      password: 'String'
    },
    type: models.AuthenTC,
    resolve: ({ context, args }) => new Promise(async (resolve) => {
      // Error
      const onError = err => {
        context.nap.errors.push({ code: 403, message: err.message })
        resolve(null)
      }

      // Installation
      const user = await context.nap.willSignUp(context, args.email, args.password).then(models.createUser).catch(onError)

      // Succeed
      resolve(user)
    })
  })

  models.AuthenTC.addResolver({
    name: 'forget',
    kind: 'mutation',
    args: {
      email: 'String'
    },
    type: models.AuthenTC,
    resolve: ({ context, args }) => new Promise(async (resolve) => {
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
  })

  models.AuthenTC.addResolver({
    name: 'login',
    kind: 'mutation',
    args: {
      // Devices
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      // Email, Password
      email: 'String',
      password: 'String'
    },
    type: models.AuthenTC,
    resolve: ({ context, args }) => new Promise(async (resolve) => {
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
      const installation = await models.willInstall(args).catch(onError)
      const authen = await context.nap.willAuthen(installation.id, user, 'local').catch(onError)

      // Fail
      if (!authen) {
        return onError(new Error('Authen error'))
      }

      // Succeed
      return resolve(authen)
    })
  })

  const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
    models.Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
      loggedOutAt: new Date().toISOString(),
      isLoggedIn: false
    }, { new: true, upsert: false }, (err, result) => err ? reject(err) : resolve(result))
  })

  models.AuthenTC.addResolver({
    name: 'logout',
    kind: 'mutation',
    type: models.AuthenTC,
    resolve: ({ context }) => new Promise(async (resolve, reject) => {
      // Logout from cookie
      context.logout()

      // Guard
      if (!context.nap.currentUser) {
        context.nap.errors.push({ code: 403, message: 'No session found' })
        return resolve(null)
      }

      // Logout
      const authen = await willLogout(context.nap.currentUser.installationId, context.nap.currentUser.userId, context.token)

      // Fail
      if (!authen) {
        return reject(new Error('No session found'))
      }

      // Succeed
      return resolve(authen)
    })
  })

  models.AuthenTC.addResolver({
    name: 'authen',
    kind: 'query',
    type: models.AuthenTC,
    resolve: ({ context }) => new Promise(async (resolve) => {
      const _noAuthen = {
        isLoggedIn: false,
        sessionToken: null
      }

      // Guard
      if (!context.nap.currentUser) {
        return resolve(_noAuthen)
      }

      models.Authen.findOne({
        userId: context.nap.currentUser.userId, installationId: context.nap.currentUser.installationId
      },
        (err, result) => err ? resolve(_noAuthen) : resolve(result)
      )
    })
  })
}
