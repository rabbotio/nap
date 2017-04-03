const nap = require('../..');

nap.start({
  extendUserSchema: {
    testAdd: String,
  },
  buildGraphqlSchema: ({ GQC, models }) => {
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
  },
});
