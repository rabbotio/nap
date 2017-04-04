const { addToGQC } = require('./clogii/schema')

global.nap.setBuildGraphqlSchema(({ GQC }) => {
  addToGQC(GQC);
  return GQC.buildSchema();
});
