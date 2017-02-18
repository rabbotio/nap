// Here's how to restrict access only for logged in users.
const resolvers = {
  Query: {
    getFoo: (root, { bar }, context) => {
      const name = (context.user && context.user.name)
      return `Hello ${bar} ${name ? `, Nice to see you ${name}!` : ', Please login'}` 
    }
  },
  Mutation: {
    setFoo: (_, { bar }, context) => context.user ? `Saved! ${bar}` : `Aw!, you'll need to logged in first!`
  }
}

module.exports = resolvers
