const hooks = {
  viewer: {
    pre: (next, args, foo, context, options) => {
      debug.log(options.rootValue.request.user)
      next()
    },
    post: (next, value) => {
      debug.log(value)
      next()
    }
  },
  singular: {
    pre: (next, root, args, request, options) => {
      debug.log(options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(context)
      next()
    }
  },
  plural: {
    pre: (next, root, args, request, options) => {
      debug.log(options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(context)
      next()
    }
  },
  mutation: {
    pre: (next, args, context, options) => {
      debug.log(options.rootValue.request.user)
      next()
    },
    post: (next, value, args, context) => {
      debug.log(context)
      next()
    }
  }
}

module.exports = hooks