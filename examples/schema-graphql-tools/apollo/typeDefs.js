module.exports = `
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
`