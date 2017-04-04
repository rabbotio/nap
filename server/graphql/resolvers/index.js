module.exports = (...args) => {
  require('./Authen')(...args);
  require('./Installation')(...args);
  require('./User')(...args);
};