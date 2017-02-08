/*
An exmple for simple Query and Mutation with `graphql-tools`.
*/

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
    getFoo: (root, { bar }, context) => {
      const displayName = (context.user && context.user.displayName)
      return `Hello ${bar} ${displayName ? `, Nice to see you ${displayName}!` : ', Please login'}`
    }
  },

  Mutation: {
    setFoo: (_, { bar }, context) => context.user ? `Saved! ${bar}` : `Aw!, you'll need to logged in first!`
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
})