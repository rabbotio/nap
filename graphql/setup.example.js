global.NAP.expose.extendModel('User', {
  foo: 'String',
})

global.NAP.expose.setBuildGraphqlSchema(({ GQC, models }) => {
  models.UserTC.addFields({
    bar: {
      type: 'String',
      resolve: () => 'Hello',
    },
  })
  GQC.rootQuery().addFields({
    foo: {
      type: 'Int!',
      resolve: () => 5,
    },
  })
  return GQC.buildSchema()
})
