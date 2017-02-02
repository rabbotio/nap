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
    getFoo(root, { bar }, context) {
      return `Hello ${bar}`
    }
  },

  Mutation: {
    setFoo(_, { bar }) {
      // Do something with greeting.
      return `Welcome ${bar}`
    }
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
})