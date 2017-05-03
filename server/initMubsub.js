const mubsub = require('mubsub')
const config = require('./config')
const client = mubsub(config.mubsub)

module.exports = () => {
  global.NAP.mubsub = {
    client,
  }
}
