const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')
// const { ErrorTC } = require('./ErrorSchema')

const AuthenSchema = new mongoose.Schema(
  {
    // Common
    installationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isLoggedIn: { type: Boolean, default: false },
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

const { willInstall } = require('./InstallationSchema')
const { createUser } = require('./UserSchema')

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

    // Facebook
    accessToken: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    // Installation
    const installation = await willInstall(args).catch(onError)
    const user = await context.nap.willLoginWithFacebook(context, args.accessToken).then(createUser).catch(onError)
    const authen = await context.nap.willAuthen(installation.id, user.id, 'facebook').catch(onError)

    // Fail
    if (!authen) {
      onError(new Error( 'Authen error'))
      return
    }

    // Succeed
    debug.info(' * authen :', authen)
    resolve(authen)
  })
})

const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
  debug.log(' * logout :', installationId, userId, sessionToken)

  Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false
  }, { new: true, upsert: false }, (error, result) => {
    // Error?
    error && debug.error(error) && reject(error)
    // Succeed
    resolve(result)
  })
})

AuthenTC.addResolver({
  name: 'logout',
  kind: 'mutation',
  type: AuthenTC,
  resolve: ({ context }) => new Promise(async (resolve, reject) => {
    // Logout from cookie
    context.logout()

    // Guard
    if(!context.nap.currentUser) {
      reject(new Error('No session found'))
      return
    }

    // Logout
    const authen = await willLogout(context.nap.currentUser.installationId, context.nap.currentUser.userId, context.token)    

    // Fail
    if (!authen) {
      reject(new Error('No session found'))
      return
    }

    // Succeed
    debug.info(' * authen :', authen)
    resolve(authen)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }
