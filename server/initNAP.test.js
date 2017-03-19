/* eslint-env jest */

describe('init express', () => {
  it('should init NAP', async () => {
    const { willAuthen, willLoginWithFacebook } = require('./authen')
    const req = {}
    require('./initNAP')(req, {}, () => { })
    expect(req).toEqual({
      nap: {
        errors: [],
        willAuthen,
        willLoginWithFacebook
      },
    })
  })
})