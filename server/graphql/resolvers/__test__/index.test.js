/* eslint-env jest */
describe('index', () => {
  it('should install and authen then return authen', async () => {
    // stub
    global.NAP = {}
    NAP.Authen = {
      findOneAndUpdate: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({ _id: '58d0e20e7ff032b39c2a9a18', name: 'bar' })
      )
    }

    NAP.Installation = {
      create: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({ _id: '58d0e20e7ff032b39c2a9a19' })
      )
    }

    const { willInstallAndAuthen } = require('../index')
    const device = 'FOO_DEVICE'
    const user = { id: 'FOO_USER_ID' }
    const provider = 'facebook'

    const authen = await willInstallAndAuthen(device, user, provider)

    expect(authen).toMatchSnapshot()
  })
})