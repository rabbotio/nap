const AuthenResolver = require('../resolvers/AuthenResolver')

module.exports = (models) => {
  models.AuthenTC.addRelation(
    'user',
    () => ({
      resolver: models.UserTC.getResolver('findById'),
      prepareArgs: {
        _id: (source) => `${source.userId}`,
        filter: (source) => ({ userId: source.userId }),
      },
      projection: { userId: 1 },
      catchErrors: false,
    })
  )

  models.AuthenTC.addRelation(
    'installation',
    () => ({
      resolver: models.InstallationTC.getResolver('findById'),
      prepareArgs: {
        _id: (source) => `${source.installationId}`,
        filter: (source) => ({ installationId: source.installationId }),
      },
      projection: { installationId: 1 },
      catchErrors: false,
    })
  )

  models.AuthenTC.addResolver({
    name: 'loginWithFacebook',
    kind: 'mutation',
    prepareArgs: {
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      accessToken: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.loginWithFacebook
  })

  models.AuthenTC.addResolver({
    name: 'signup',
    kind: 'mutation',
    prepareArgs: {
      email: 'String',
      password: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.signup
  })

  models.AuthenTC.addResolver({
    name: 'forget',
    kind: 'mutation',
    prepareArgs: {
      email: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.forget
  })

  models.AuthenTC.addResolver({
    name: 'login',
    kind: 'mutation',
    prepareArgs: {
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
    resolve: AuthenResolver.login
  })

  models.AuthenTC.addResolver({
    name: 'logout',
    kind: 'mutation',
    type: models.AuthenTC,
    resolve: AuthenResolver.logout
  })

  models.AuthenTC.addResolver({
    name: 'authen',
    kind: 'query',
    type: models.AuthenTC,
    resolve: AuthenResolver.authen
  })
}
