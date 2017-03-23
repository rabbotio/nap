class GenericError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

module.exports = {
  GenericError,
  SESSION_EMPTY_ERROR: new GenericError(190, 'User has no session provide')
}