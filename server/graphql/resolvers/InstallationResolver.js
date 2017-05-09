const willInstall = (device) => new Promise((resolve, reject) => {
  NAP.Installation.create(device, (err, result) => err ? reject(err) : resolve(result))
})

const _willUpdateField = (installationId, fieldObject) => new Promise((resolve, reject) => {
  NAP.Installation.findOneAndUpdate(
    // Find
    { installationId },
    // Update
    fieldObject,
    // Options
    { new: true, upsert: false },
    // Callback
    (err, result) => err ? reject(err) : resolve(result)
  )
})

const willUpdateField = field => ({ context, args }) => new Promise(async (resolve, reject) => {
  if (!context.nap.session) {
    reject(new Error('No session found'))
    return
  }

  const installation = await _willUpdateField(context.nap.session.installationId, { [field]: args[field] })

  if (!installation) {
    reject(new Error('No installation found'))
    return
  }

  resolve(installation)
})

module.exports = { willInstall, willUpdateField }
