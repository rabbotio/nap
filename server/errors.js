class ErrorWithCode extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }

  toObject(raw) {
    const { code, message } = raw || this
    return { code, message }
  }
}

const createErrorWithCode = (code, message) => {
  const error = new ErrorWithCode(code, message)
  error.code = code
  return error
}

module.exports = {
  SESSION_EMPTY: createErrorWithCode(190, 'User has no session provide')
}