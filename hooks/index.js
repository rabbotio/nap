const hooks = {
  viewer: {
    pre: (next, args, foo, context, options) => {
      debug.log(`viewer.pre.user:`, options.rootValue.request.user)
      next()
    },
    post: (next, value) => {
      debug.log(`viewer.value:`, value)
      next()
    }
  },
  singular: {
    pre: (next, root, args, request, options) => {
      debug.log(`singular.pre.user:`, options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(`singular.post.context:`, context)
      next()
    }
  },
  plural: {
    pre: (next, root, args, request, options) => {
      debug.log(`plural.pre.user:`, options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(`plural.post.context:`, context)
      next()
    }
  },
  mutation: {
    pre: (next, args, context, options) => {
      debug.log(`mutation.pre.user:`, options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(`mutation.post.context:`, context)
      next()
    }
  }
}

module.exports = hooks