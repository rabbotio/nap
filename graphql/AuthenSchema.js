const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const AuthenSchema = new mongoose.Schema(
  {
    installationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    loggedInAt: Date,
    loggedInWith: String,
    loggedOutAt: Date,
    sessionToken: String,
    accessToken: String,
  },
  {
    timestamps: true,
  }
)

// - - - - - - Plugins - - - - - -

const Authen = mongoose.model('Authen', AuthenSchema)
const AuthenTC = composeWithMongoose(Authen)

// - - - - - - Relation - - - - - -

const { InstallationTC } = require('./InstallationSchema')
const { UserTC } = require('./UserSchema')

AuthenTC.addRelation(
  'user',
  () => ({
    resolver: UserTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ userId: source.userId }),
      skip: null,
      sort: null,
    },
    projection: { userId: true },
  })
)

AuthenTC.addRelation(
  'installation',
  () => ({
    resolver: InstallationTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ userId: source.installationId }),
      skip: null,
      sort: null,
    },
    projection: { installationId: true },
  })
)

// - - - - - - Extras - - - - - -

const { InstallationSchema, install } = require('./InstallationSchema')
const { createUser } = require('./UserSchema')

// TODO : Dependency Injection
const createSessionToken = (installationId, userId) => {
  const jwt = require('jsonwebtoken')
  const sessionToken = jwt.sign({
    installationId,
    userId,
    createdAt: new Date().toISOString()
  },
    NAP.Config.jwt_secret
  )

  return sessionToken
}

const authen = (installationId, userId, provider) => new Promise((resolve, reject) => {
  debug.log(' * authen :', installationId, userId)

  Authen.findOneAndUpdate({ installationId }, {
    installationId,
    userId,
    loggedInAt: new Date().toISOString(),
    loggedInWith: provider,
    sessionToken: createSessionToken(installationId, userId)
  }, { upsert: true },  (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

debug.info('AuthenTC.addResolver')

AuthenTC.addResolver({
  name: 'loginWithFacebook',
  kind: 'mutation',
  args: {
    // Devices
    deviceInfo: 'String',
    locale: 'String',
    country: 'String',
    timezone: 'String',
    deviceName: 'String',
    isEmulater: 'Boolean',
    isTablet: 'Boolean',

    // App
    bundleId: 'String',
    appVersion: 'String',

    // Notifications
    GCMSenderId: 'String',
    deviceToken: 'String',
    badge: 'String',
    channels: 'String',

    // Facebook
    accessToken: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise( (resolve, reject) => {
      (async () => {
      // Installation
      const installation = await install(args)
      const user = await context.loginWithFacebook(args.accessToken).then(createUser)
      context.authen = await authen(installation.id, user.id, 'facebook')

      debug.info(' * context.authen :', context.authen)

      resolve(context)
    })()}) /*{

    // Already logged in, we should throw warning
    if (context.authen) {
      debug.warn('Already logged in.')
      return
    }

    // Will install and authen
    (async () => {
      // Installation
      const installation = await install(args)
      context.authen = await authen(installation._id, context.user._id, 'facebook')

      return context.authen
    })()
  }*/
})

AuthenTC.setResolver('loginWithFacebook', AuthenTC.getResolver('loginWithFacebook')
  .wrapResolve(next => resolveParams => {
    // CAPTURING PHASE : resolveParams = { source, args, context, info }
    const { args, context } = resolveParams

    // debug.log(' * resolveParams.context :', resolveParams.context)

    // Already logged in, we should throw warning
    if (context.authen) {
      debug.warn('Already logged in.')
      return next(resolveParams)
    }
    const resultPromise = next(resolveParams);

    // BUBBLING PHASE
    resultPromise.then(payload => { console.log(payload); return payload; })
    /*
    resultPromise.then(payload => new Promise( (resolve, reject) => {
      (async () => {
      // Installation
      const installation = await install(args)
      context.authen = await authen(installation._id, context.user._id, 'facebook')

      debug.info(' * context.authen :', context.authen)

      resolve(payload)
    })()
  }))
  */

    return resultPromise;
  }))
// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }