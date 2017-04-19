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
  });

  models.UserTC.addResolver({
    name: 'unlinkFacebook',
    kind: 'query',
    type: models.UserTC,
    resolve: async ({ context }) => {
      const user = await models.User.findById(context.nap.currentUser.userId);
      if (!user) {
        throw new Error('Authen error');
      }

      if (user.facebook) {
        user.facebook.isUnlink = true;
      }

      await user.save();
      return user;
    },
  });

  models.UserTC.addResolver({
    name: 'linkFacebook',
    kind: 'query',
    type: models.UserTC,
    args: {
      accessToken: 'String!'
    },
    resolve: async ({ args, context }) => {
      const user = await models.User.findById(context.nap.currentUser.userId);
      if (!user) {
        throw new Error('Authen error');
      }

      const userData = await context.nap.willLoginWithFacebook(context, args.accessToken);
      user.facebook = userData.facebook;

      await user.save();
      return user;
    },
  });
}