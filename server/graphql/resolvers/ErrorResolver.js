module.exports.resolver = ({ context }) => context.nap.errors.length > 0 ? context.nap.errors : null
