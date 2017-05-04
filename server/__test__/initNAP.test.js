/* eslint-env jest */
describe('NAP Server', () => {
  test('initNAP', () => {
    const req = {}

    // Run
    require('../initNAP')(req, {}, () => { })
    expect(req).toMatchSnapshot()
  })
})
