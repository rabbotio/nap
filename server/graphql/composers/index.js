module.exports = (models) => {
  require('./Authen')(models)
  require('./Installation')(models)
  require('./User')(models)
}
