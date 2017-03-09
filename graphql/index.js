// - - - - - - GraphQL - - - - - -

// create new GQC from ComposeStorage
const { ComposeStorage } = require('graphql-compose')
const GQC = new ComposeStorage()

const { InstallationTC } = require('./InstallationSchema')
const { UserTC } = require('./UserSchema')
const { AuthenTC } = require('./AuthenSchema')

// ACL
const userAccess = (resolvers) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(next => (rp) => {
      // rp = resolveParams = { source, args, context, info }
      if (!NAP.Security.isLoggedIn(rp.context)) {
        throw new Error('You should be logged in, to have access to this action.');
      }
      return next(rp);
    });
  });
  return resolvers;
}

// create GraphQL Schema with all available resolvers for User Type
GQC.rootQuery().addFields(
  // let add restriction for owner only
  userAccess({
    userById: UserTC.getResolver('findById'),
    userByIds: UserTC.getResolver('findByIds'),
    userOne: UserTC.getResolver('findOne'),
    userMany: UserTC.getResolver('findMany'),
    userTotal: UserTC.getResolver('count'),
    userConnection: UserTC.getResolver('connection'),
  })
)

GQC.rootMutation().addFields({
  userCreate: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),

  init: InstallationTC.getResolver('createOne'),
  loginWithFacebook: AuthenTC.getResolver('loginWithFacebook'),
})

module.exports = GQC.buildSchema()