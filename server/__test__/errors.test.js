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

  it('should add error new generic error to request', () => {
    const { onError } = require('../errors')
    const req = { nap: { errors:[] } }
    onError(req)(new Error('foo'))

    expect(req.nap.errors[0]).toMatchSnapshot()
  })

  it('should add string as new generic error to request', () => {
    const { onError } = require('../errors')
    const req = { nap: { errors:[] } }
    onError(req)('foo')

    expect(req.nap.errors[0]).toMatchSnapshot()
  })

  it('should add code, string as new generic error to request', () => {
    const { onError } = require('../errors')
    const req = { nap: { errors:[] } }
    onError(req)(403, 'foo')

    expect(req.nap.errors[0]).toMatchSnapshot()
  })

  it('should add code as new generic error to request', () => {
    const { onError } = require('../errors')
    const req = { nap: { errors:[] } }
    onError(req)(3)

    expect(req.nap.errors[0]).toMatchSnapshot()
  })

  it('should add code with common error as new generic error to request', () => {
    const { onError } = require('../errors')
    const req = { nap: { errors:[] } }
    onError(req)(403)

    expect(req.nap.errors[0]).toMatchSnapshot()
  })
})
