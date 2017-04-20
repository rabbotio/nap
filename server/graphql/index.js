const defaultBuildSchema = ({ GQC }) => {
  return GQC.buildSchema();
}

let buildGraphqlSchema = null;

module.exports = {};
module.exports.getFile = (fileInput, context) => {
  if (!fileInput || !fileInput.mapKey) {
    return null;
  }
  return context.files.find(file => {
    return file.originalname === fileInput.mapKey;
  });
};
module.exports.extendModel = require('./models').extendModel;
module.exports.setBuildGraphqlSchema = (builder) => buildGraphqlSchema = builder;
module.exports.buildSchema = () => {
  const { ComposeStorage } = require('graphql-compose')
  const GQC = new ComposeStorage()
  const models = require('./models')();
  require('./resolvers')(models);

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
      unlinkFacebook: models.UserTC.getResolver('unlinkFacebook'),
      linkFacebook: models.UserTC.getResolver('linkFacebook'),
      changeEmail: models.UserTC.getResolver('changeEmail'),
      loginWithEmail: models.AuthenTC.getResolver('loginWithEmail'),
      update_GCMSenderId: models.InstallationTC.getResolver('update_GCMSenderId'),
      update_deviceToken: models.InstallationTC.getResolver('update_deviceToken'),
      errors: models.ErrorTC.getResolver('error'),
    }
  );

  if (buildGraphqlSchema) {
    return buildGraphqlSchema({ GQC, models })
  }
  return defaultBuildSchema({ GQC });
};
