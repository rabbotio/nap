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
  // Error('foo')  
  if (args[0] instanceof Error) {
    _push(req, new GenericError(0, args[0].message))
    return
  }

  // 'foo'
  if (typeof args[0] === 'string') {
    _push(req, new GenericError(0, args[0]))
    return
  }

  // 403, 'foo'  
  if (typeof args[0] === 'number' && typeof args[1] === 'string') {
    _push(req, new GenericError(...args))
    return
  }

  // 403
  if (typeof args[0] === 'number' && args.length === 1) {
    _push(req, new GenericError(args[0], _COMMON_ERRORS[args[0]] || ''))
    return
  }
}

const guard = (arg, msg) => {
  const is = require('is_js')
  if (!arg) { throw new Error('Required : Object e.g. { foo }') }
  if (is.not.existy(Object.values(arg)[0])) {
    throw new GenericError(0, msg || `Required : ${Object.keys(arg)[0]}`)
  }

  return false
}

module.exports = {
  GenericError,
  SESSION_EMPTY_ERROR: new GenericError(190, 'User has no session provide'),
  onError,
  guard
}