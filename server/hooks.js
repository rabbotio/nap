const hooks = {
  viewer: {
    pre: (next, args, foo, context, options) => {
      console.log(options.rootValue.request.user);
      next()
    },
    post: (next, value) => {
      next()
    }
  },
  singular: {
    pre: (next, root, args, request, options) => {
      console.log(options.rootValue.request.user);
      next();
    },
    post: (next, value, args, context) => {
      next();
    }
  },
  plural: {
    pre: (next, root, args, request, options) => {
      console.log(options.rootValue.request.user);
      next();
    },
    post: (next, value, args, context) => {
      next();
    }
  },
  mutation: {
    pre: (next, args, context, options) => {
      console.log(options.rootValue.request.user);
      next();
    },
    post: (next, value, args, context) => {
      next();
    }
  }
}

module.exports = hooks