class GenericError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const _COMMON_ERRORS = {
  403: 'Forbidden',
  501: 'Server error',
}

const _push = (req, { code, message }) => req.nap.errors.push({ code, message })

const onError = (req) => (...args) => {
  let error

  // Error('foo')  
  if (args[0] instanceof Error) {
    _push(req, new GenericError(0, args[0].message))
    return error
  }

  // 'foo'
  if (args[0] instanceof String) {
    _push(req, new GenericError(0, 'Unknown error'))
    return error
  }

  // 403, 'foo'  
  if (args[0] instanceof Number && args[1] instanceof String) {
    _push(req, new GenericError(...args))
    return error
  }

  // 403
  if (args[0] instanceof Number && args.length === 1) {
    _push(req, new GenericError(0, _COMMON_ERRORS[args[0]] || ''))
    return error
  }
}

module.exports = {
  SESSION_EMPTY_ERROR: new GenericError(190, 'User has no session provide'),
  onError
}