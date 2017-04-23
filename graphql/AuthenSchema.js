const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

// - - - - - - Extra fields - - - - - -

let _extraAuthenSchema = {}
try {
  const { extraAuthenSchema } = require('./custom')
  _extraAuthenSchema = extraAuthenSchema
} catch (err) { err }

// - - - - - - Default fields - - - - - -

const AuthenSchemaObject = {
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
}

const AuthenSchema = new mongoose.Schema(
  Object.assign(
    AuthenSchemaObject,
    _extraAuthenSchema
  ), {
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

    // User
    const user = await context.nap.willLoginWithFacebook(context, args.accessToken).then(createUser).catch(onError)
    
    // Guard
    if (!user) {
      return onError(new Error('User not exist'))
    }

    // Link
    const installation = await willInstall(args).catch(onError)
    const authen = await context.nap.willAuthen(installation.id, user, 'facebook').catch(onError)

    // Fail
    if (!authen) {
      onError(new Error('Authen error'))
      return
    }

    // Succeed
    resolve(authen)
  })
})

AuthenTC.addResolver({
  name: 'signup',
  kind: 'mutation',
  args: {
    email: 'String',
    password: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    // Installation
    const user = await context.nap.willSignup(context, args.email, args.password).then(createUser).catch(onError)

    // Succeed
    resolve(user)
  })
})

AuthenTC.addResolver({
  name: 'login',
  kind: 'mutation',
  args: {
    // Devices
    deviceInfo: 'String',
    locale: 'String',
    country: 'String',
    timezone: 'String',
    deviceName: 'String',

    // Email, Password
    email: 'String',
    password: 'String'
  },
  type: AuthenTC,
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
      return onError(new Error('User not exist'))
    }

    // Link
    const installation = await willInstall(args).catch(onError)
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
  Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false
  }, { new: true, upsert: false }, (err, result) => err ? reject(err) : resolve(result))
})

AuthenTC.addResolver({
  name: 'logout',
  kind: 'mutation',
  type: AuthenTC,
  resolve: ({ context }) => new Promise(async (resolve, reject) => {
    // Logout from cookie
    context.logout()

    // Guard
    if (!context.nap.currentUser) {
      return reject(new Error('No session found'))
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

// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }
