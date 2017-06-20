const InstallationResolver = require('../resolvers/InstallationResolver')

module.exports = (models) => {
  const fields = ['GCMSenderId', 'deviceToken']
  fields.map(field => models.InstallationTC.addResolver({
    name: `update_${field}`,
    kind: 'mutation',
    prepareArgs: {
      [field]: 'String'
    },
    type: models.InstallationTC,
    resolve: InstallationResolver.willUpdateField(field)
  }))
}
