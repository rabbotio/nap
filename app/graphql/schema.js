const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = [`
type Query {
  getFoo(
    # Any String.
    bar: String!
  ): String
}

type Mutation {
  # Set something
  setFoo(
    # Any String.
    bar: String!
  ): String
}

schema {
  query: Query
  mutation: Mutation
}
`];

const resolvers = {
  Query: {
    getFoo: (root, { bar }, context) => `Hello ${bar} ${context.user ? ', Nice to see you logged in' : ', Please login'}`
  },

  Mutation: {
    setFoo: (_, { bar }, context) => context.user ? `Saved! ${bar}` : `Aw!, you'll need to logged in first!`
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
})