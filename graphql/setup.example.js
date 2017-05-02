global.NAP.expose.extendModel('User', {
  extenddedString: 'String',
});

global.NAP.expose.setBuildGraphqlSchema(({ GQC, models }) => {
  models.UserTC.addFields({
    extendedFeild: {
      type: 'String',
      resolve: () => 'Hello',
    },
  });
  GQC.rootQuery().addFields({
    foo: {
      type: 'Int!',
      resolve: () => 5,
    },
  });
  return GQC.buildSchema();
});
