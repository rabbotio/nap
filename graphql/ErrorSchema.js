const { TypeComposer } = require('graphql-compose')

const ErrorTC = TypeComposer.create(`
  type Error {
    code: Int,
    message: String!,
  }
`)

ErrorTC.addResolver({
  name: 'error',
  kind: 'query',
  type: ErrorTC,
  resolve: ({ context }) => context.nap.error
})

// - - - - - - Exports - - - - - -

module.exports = { ErrorTC }