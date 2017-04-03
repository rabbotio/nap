module.exports = (models) => {
  models.UserTC.addResolver({
    name: 'user',
    kind: 'query',
    type: models.UserTC,
    resolve: ({ context }) => new Promise(async (resolve) => {
      if (context.nap.error) {
        return
      }

      const onError = err => {
        context.nap.errors.push({ code: 403, message: err.message })
        resolve(null)
      }

      const user = await new Promise((reslove, reject) => models.User.findById(context.nap.currentUser.userId, (err, result) => {
        if (err) {
          reject(err)
          return
        }

        reslove(result)
      }))

      if (!user) {
        onError(new Error('Authen error'))
        return
      }

      resolve(user)
    })
  })
}