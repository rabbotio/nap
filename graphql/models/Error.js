module.exports = () => {
  const { TypeComposer } = require('graphql-compose')
  const { GraphQLList } = require('graphql')

  const ErrorTC = TypeComposer.create(`
    type Error {
      code: Int,
      message: String!,
    }
  `)

  ErrorTC.addResolver({
    name: 'error',
    kind: 'query',
    type: new GraphQLList(ErrorTC.getType()),
    resolve: ({ context }) => context.nap.errors
  })

  return { ErrorTC }
}