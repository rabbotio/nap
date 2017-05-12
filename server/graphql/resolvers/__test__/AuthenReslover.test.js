/* eslint-env jest */
describe('AuthenResolver', () => {
  it('should authen and return user', async () => {
    // stub
    global.NAP = {}
    NAP.Authen = {
      findOneAndUpdate: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({ _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
      )
    }

    const authen = require('../AuthenResolver')
    const installationId = 'FOO_INSTALLATION_ID'
    const userObject = { id: 'FOO_USER_ID' }
    const provider = 'facebook'

    const user = await authen.willAuthen(installationId, userObject, provider)

    expect(user).toMatchSnapshot()
  })
})