const { UserSchema } = require('./UserSchema')

const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

require('mongoose-schema-extend')
const PlayerSchema = UserSchema.extend({
  score: Number
})

const Player = mongoose.model('Player', PlayerSchema)
const PlayerTC = composeWithMongoose(Player)

PlayerTC.addResolver({
  name: 'player',
  kind: 'query',
  type: PlayerTC,
  resolve: ({ context }) => new Promise(async (resolve) => {
    // Guard
    if (context.nap.error) {
      return
    }

    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    const player = await new Promise((reslove, reject) => Player.findById(context.nap.currentUser.userId, (err, result) => {
      // Fail
      if (err) {
        reject(err)
        return
      }

      // Succeed
      reslove(result)
    }))

    // Fail
    if (!player) {
      onError(new Error('Authen error'))
      return
    }

    // Succeed
    resolve(player)
  })
})

module.exports = { Player, PlayerTC }