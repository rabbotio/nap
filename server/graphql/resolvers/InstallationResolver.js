const { onError } = require('../../errors')

const willInstall = async (device) => await NAP.Installation.create(device)

const _willUpdateField = async (installationId, fieldObject) => await NAP.Installation.findOneAndUpdate(
  { installationId }, // Find
  fieldObject, // Update
  { new: true, upsert: false } // Options
)

const willUpdateField = field => async ({ context, args }) => {
  if (!context.nap.session) throw new Error('No session found')

  const installation = await _willUpdateField(context.nap.session.installationId, { [field]: args[field] })
  if (!installation) throw new Error('No installation found')
  return installation
}

module.exports = { willInstall, willUpdateField }
