global.nap.extendModel('User', {
  extenddedString: 'String',
});

global.nap.setBuildGraphqlSchema(({ GQC, models }) => {
  models.UserTC.addFields({
    extendedFeild: {
      type: 'String',
      resolve: () => 'HEllo',
    },
  });
  GQC.rootQuery().addFields({
    sss: {
      type: 'Int!',
      resolve: () => 5,
    },
  });
  return GQC.buildSchema();
});
