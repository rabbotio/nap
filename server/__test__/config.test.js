/* eslint-env jest */

require('../config')

describe('config', () => {
  it('should return config', () => {
    expect(global.NAP.Config).toMatchSnapshot()
  })
})
