module.exports = (config) => {
  return Object.assign(
   require('./User')(config),
   require('./Installation')(config),
   require('./Authen')(config),
   require('./Error')(config)
  );
};