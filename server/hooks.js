const authorize = req => {
  const session = req.session
  if(session){
    consol.log("No session :(")
  } else {
    consol.log("Nice session :)")
  }
}

const hooks = {
  viewer: {
    pre: (next, root, args, request) => {
      // authorize the logged in user based on the request
      authorize(request)
      next()
    },
    post: (next, value) => {
      console.log(value)
      next()
    }
  },
  // singular: {
  //   pre: (next, root, args, context) => next(),
  //   post: (next, value, args, context) => next()
  // },
  // plural: {
  //   pre: (next, root, args, context) => next(),
  //   post: (next, value, args, context) => next()
  // },
  // mutation: {
  //   pre: (next, args, context) => next(),
  //   post: (next, value, args, context) => next()
  // }
}

module.exports = hooks