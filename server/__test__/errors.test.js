/* eslint-env jest */

describe('errors', () => {
  it('should return error', async () => {
    const { GenericError } = require('../errors')
    const customError = {
      code: 500,
      message: 'Foo error!'
    }
    const err = new GenericError(customError.code, customError.message)
    
    expect(err).toMatchObject(customError)
  })

  it('should return SESSION_EMPTY_ERROR', async () => {
    const { SESSION_EMPTY_ERROR } = require('../errors')
    const SNAP_SESSION_EMPTY_ERROR = {
      code: 190,
      message: 'User has no session provide'
    }
    
    expect(SESSION_EMPTY_ERROR).toMatchObject(SNAP_SESSION_EMPTY_ERROR)
  })
})
