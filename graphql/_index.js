// - - - - - - GraphQL - - - - - -

// create new GQC from ComposeStorage
const { ComposeStorage } = require('graphql-compose')
const GQC = new ComposeStorage()

const { ErrorTC } = require('./ErrorSchema')
const { UserTC } = require('./UserSchema')
const { AuthenTC } = require('./AuthenSchema')

// ACL
const userAccess = (resolvers) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(next => (rp) => {
      // rp = resolveParams = { source, args, context, info }
      if (!rp.context.nap.currentUser) {
        // throw new Error('[NOSTACK] Permission denied')
        rp.context.nap.errors.push({ code: 403, message: 'No session found' })
        return null
      }

      return next(rp)
    })
  })
  return resolvers
}

// create GraphQL Schema with all available resolvers for User Type
GQC.rootQuery().addFields(Object.assign(
  userAccess({
    // let add restriction for owner only
    user: UserTC.getResolver('user'),
  }), {
    errors: ErrorTC.getResolver('error'),
  })
)

GQC.rootMutation().addFields(
  {
    logout: AuthenTC.getResolver('logout'),
    loginWithFacebook: AuthenTC.getResolver('loginWithFacebook'),
    errors: ErrorTC.getResolver('error'),
  }
)

module.exports = { GQC, userAccess }