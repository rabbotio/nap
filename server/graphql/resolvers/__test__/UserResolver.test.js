/* eslint-env jest */
describe('willReadUser', () => {
  it('should return error if session not exist', async () => {
    const { user : willReadUser } = require('../UserResolver')
    const context = { nap : {errors: []} }
    await willReadUser({ context }).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })
})