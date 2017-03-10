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
        throw new Error('[NOSTACK] Permission denied')
      }

      return next(rp)
    })
  })
  return resolvers
}

// create GraphQL Schema with all available resolvers for User Type
GQC.rootQuery().addFields(Object.assign(
  // let add restriction for owner only
  userAccess({
    userById: UserTC.getResolver('findById'),
  }), {
    error: ErrorTC.getResolver('error'),
  })
)

GQC.rootMutation().addFields({
  loginWithFacebook: AuthenTC.getResolver('loginWithFacebook'),
  logout: AuthenTC.getResolver('logout'),
  error: ErrorTC.getResolver('error'),
})

module.exports = GQC.buildSchema()