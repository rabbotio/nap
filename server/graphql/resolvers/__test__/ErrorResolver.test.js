/* eslint-env jest */
describe('AuthenResolver', () => {
  it('should return null if no error', () => {
    const ErrorResolver = require('../ErrorResolver')
    const context = { nap: { errors: [] } }
    expect(ErrorResolver.resolver({ context })).toMatchSnapshot()
  })

  it('should return errors if has any error', () => {
    const ErrorResolver = require('../ErrorResolver')
    const { onError } = require('../../../errors')
    const context = { nap: { errors: [] } }
    onError(context)(new Error('foo'))

    expect(ErrorResolver.resolver({ context })).toMatchSnapshot()
  })
})