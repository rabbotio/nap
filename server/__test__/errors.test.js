/* eslint-env jest */

describe('errors', () => {
  it('should return error', () => {
    const { GenericError } = require('../errors')
    const customError = {
      code: 500,
      message: 'Foo error!'
    }
    const err = new GenericError(customError.code, customError.message)

    expect(err).toMatchObject(customError)
  })

  it('should return SESSION_EMPTY_ERROR', () => {
    const { SESSION_EMPTY_ERROR } = require('../errors')
    expect(SESSION_EMPTY_ERROR).toMatchSnapshot()
  })

  it('should guard null and throw error', () => {
    const { guard } = require('../errors')
    expect(() => guard()).toThrow('Required : Object e.g. { foo }')
    expect(() => guard({ foo: null })).toThrow('Required : foo')
    expect(() => guard({ foo: undefined })).toThrow('Required : foo')
  })
})
