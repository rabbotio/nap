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

module.exports = resolvers
