/* eslint-env jest */
describe('InstallationResolver', () => {
  it('should install and return installation data', async () => {
    // mock
    const deviceInfo = 'Chrome 58.0.3029.110 on OS X 10.12.4 64-bit'

    // stub
    global.NAP = {}
    NAP.Installation = {
      create: jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          _id: '592c0bb41b46e001780f00a6',
          deviceInfo
        })
      )
    }

    const { willInstall } = require('../InstallationResolver')
    const installation = await willInstall(deviceInfo)

    expect(installation).toMatchSnapshot()
  })

  it('should update fields and return installation data', async () => {
    // mock
    const fieldObject = { foo: 'bar' }

    // stub
    global.NAP = {}
    NAP.Installation = {
      findOneAndUpdate: jest.fn().mockImplementationOnce(() =>
        Promise.resolve(Object.assign(
          { _id: '592c0bb41b46e001780f00a6' },
          fieldObject
        ))
      )
    }

    const context = { nap : {session: { installationId: 'foo' }}}
    const args = { foo: 'bar'}
    const { willUpdateField } = require('../InstallationResolver')
    const installation = await willUpdateField(fieldObject)({ context, args })

    expect(installation).toMatchSnapshot()
  })

  it('should throw error if session not exist', async () => {
    // mock
    const fieldObject = { foo: 'bar' }

    const context = { nap : {session: null}}    
    const args = { foo: 'bar'}
    const { willUpdateField } = require('../InstallationResolver')
    await willUpdateField(fieldObject)({ context, args }).catch(err => {
      expect(() => { throw err }).toThrow('No session found')
    })
  })
})