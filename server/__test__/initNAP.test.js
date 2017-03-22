/* eslint-env jest */
describe('NAP Server', () => {

  test('initNAP', () => {
    // Setup
    const { willAuthen, willLoginWithFacebook } = require('../authen')
    const req = {}

    // Run
    require('../initNAP')(req, {}, () => { })
    expect(req).toEqual({
      nap: {
        errors: [],
        willAuthen,
        willLoginWithFacebook
      },
    })
  })
  
})