module.exports = {
  start: (config) => {
    require("./server")(config);
  },
  extendModel: require('./graphql/models').extendModel,
};
