module.exports = (models) => {
  const fields = ['GCMSenderId', 'deviceToken']
  fields.map(field => models.InstallationTC.addResolver({
    name: `update_${field}`,
    kind: 'mutation',
    args: {
      [field]: 'String',
    },
    type: models.InstallationTC,
    resolve: ({ context, args }) => new Promise(async (resolve, reject) => {
      if (!context.nap.currentUser) {
        reject(new Error('No session found'))
        return
      }

      const installation = await models.willUpdateField(context.nap.currentUser.installationId, { [field]: args[field] })

      if (!installation) {
        reject(new Error('No installation found'))
        return
      }

      resolve(installation)
    })
  }))
}