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

const { install } = require('./InstallationSchema')
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
  }, { new: true, upsert: true }, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

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

    // Facebook
    accessToken: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve, reject) => (async () => {
      // Installation
      const installation = await install(args)
      const user = await context.loginWithFacebook(args.accessToken).then(createUser)
      context.authen = await authen(installation.id, user.id, 'facebook')

      // Fail
      if (!context.authen) {
        debug.error('No authen') && reject(null)
        return
      }

      // Succeed
      debug.info(' * context.authen :', context.authen)
      resolve(context.authen)
    })()
  )
})

// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }