module.exports = () => {
  const { TypeComposer } = require('graphql-compose')
  const { GraphQLList } = require('graphql')

  const ErrorTC = TypeComposer.create(`
    type Error {
      code: Int,
      message: String!,
    }
  `)

  const ErrorResolver = require('../resolvers/ErrorResolver')
  
  ErrorTC.addResolver({
    name: 'error',
    kind: 'query',
    type: new GraphQLList(ErrorTC.getType()),
    resolve: ErrorResolver.resolver
  })

  return { ErrorTC }
}