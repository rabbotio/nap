const InstallationResolver = require('../resolvers/InstallationResolver')

module.exports = (models) => {
  models.InstallationTC.addResolver({
    name: 'installation',
    kind: 'query',
    type: models.InstallationTC,
    resolve: InstallationResolver.installation
  })

  const fields = ['GCMSenderId', 'deviceToken']
  fields.map(field => models.InstallationTC.addResolver({
    name: `update_${field}`,
    kind: 'mutation',
    args: {
      [field]: 'String'
    },
    type: models.InstallationTC,
    resolve: InstallationResolver.willUpdateField(field)
  }))
}
