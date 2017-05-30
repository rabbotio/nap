/* eslint-env jest */
describe('willReadUser', () => {
  it('should return error if session not exist', async () => {
    const { user : willReadUser } = require('../UserResolver')
    const context = { nap : { errors: []} }
    await willReadUser({ context }).catch(err => {
      expect(err).toMatchSnapshot()
    })
  })

  it('should return user data if has session', async () => {
    // mock
    const userData = { foo: 'bar' }

    // stub
    global.NAP = {}
    NAP.User = {
      findById: jest.fn().mockImplementationOnce(() =>
        Promise.resolve(Object.assign(
          {
            _id: '592c0bb4484d740e0e73798b',
            role: 'user'
          },
          userData
        ))
      )
    }

    const { user : willReadUser } = require('../UserResolver')
    const context = { nap: { session: { userId: 'foo' }}}
    const user = await willReadUser({ context })

    expect(user).toMatchSnapshot()
  })

  it('should create user and return user data', async () => {
    // mock
    const userData = { foo: 'bar' }

    // stub
    global.NAP = {}
    NAP.User = {
      create: jest.fn().mockImplementationOnce(() =>
        Promise.resolve(Object.assign(
          {
            _id: '592c0bb4484d740e0e73798b',
            role: 'user'
          },
          userData
        ))
      )
    }

    const { willCreateUser } = require('../UserResolver')
    const user = await willCreateUser(userData)

    expect(user).toMatchSnapshot()
  })
})