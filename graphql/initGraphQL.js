const initGraphQL = (extendedUserFields) => {
  

  const mongoose = require('mongoose')
  const { composeWithMongoose } = require('graphql-compose-mongoose')

  require('mongoose-schema-extend')
  const PlayerSchema = UserSchema.extend(extendedUserFields)

  const Player = mongoose.model('Player', PlayerSchema)
  const PlayerTC = composeWithMongoose(User)

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

      NAP.Player
      context.nap.db.Player

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

  exports.Player = Player
  exports.PlayerTC = PlayerTC

  NAP.User = mongoose.model('Player')
}

exports.initGraphQL = initGraphQL