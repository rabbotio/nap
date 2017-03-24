const { GQC, userAccess } = require('./_index')
const mongoose = require('mongoose')
const { PlayerTC } = require('./PlayerSchema')

GQC.rootQuery().addFields(Object.assign(
  userAccess({
    player: PlayerTC.getResolver('player'),
  }),
  { 
    playerOne: PlayerTC.getResolver('findOne')
  })
)

NAP.User = mongoose.model('Player')

module.exports = GQC.buildSchema()