// create new GQC from ComposeStorage
const { ComposeStorage } = require('graphql-compose')
const GQC = new ComposeStorage()

const { InstallationTC } = require('./InstallationSchema')
const { UserTC } = require('./UserSchema')

// create GraphQL Schema with all available resolvers for User Type
GQC.rootQuery().addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userTotal: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
})

GQC.rootMutation().addFields({
  userCreate: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),

  init: InstallationTC.getResolver('createOne'),
})

module.exports = GQC.buildSchema()