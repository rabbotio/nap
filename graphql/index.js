const defaultBuildSchema = ({ GQC }) => {
  return GQC.buildSchema();
}

module.exports = {};
module.exports.buildSchema = (config) => {
  const { ComposeStorage } = require('graphql-compose')
  const GQC = new ComposeStorage()
  const models = require('./models')(config);
  require('./resolvers')(models, config);

  const userAccess = (resolvers) => {
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve(next => (rp) => {
        if (!rp.context.nap.currentUser) {
          rp.context.nap.errors.push({ code: 403, message: 'No session found' })
          return null
        }

        return next(rp)
      })
    })
    return resolvers
  }

  GQC.rootQuery().addFields(Object.assign(
    userAccess({
      user: models.UserTC.getResolver('user'),
    }), {
      errors: models.ErrorTC.getResolver('error'),
    })
  )

  GQC.rootMutation().addFields(
    {
      logout: models.AuthenTC.getResolver('logout'),
      loginWithFacebook: models.AuthenTC.getResolver('loginWithFacebook'),
      loginWithEmail: models.AuthenTC.getResolver('loginWithEmail'),
      update_GCMSenderId: models.InstallationTC.getResolver('update_GCMSenderId'),
      update_deviceToken: models.InstallationTC.getResolver('update_deviceToken'),
      errors: models.ErrorTC.getResolver('error'),
    }
  );

  // return { GQC, User };
  return defaultBuildSchema({ GQC });
};
