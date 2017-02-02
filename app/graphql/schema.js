/*
const graphql = require('graphql')
const GraphQLSchema = graphql.GraphQLSchema
const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLString = graphql.GraphQLString

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});
*/
const { makeExecutableSchema } = require('graphql-tools')

const rootSchema = [`
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

const rootResolvers = {
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

const schema = [...rootSchema]
const resolvers = rootResolvers

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

module.exports = executableSchema;