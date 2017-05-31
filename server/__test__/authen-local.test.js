/* eslint-env jest */

describe('authen-local', () => {
  it('should throw error if has no email and password', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = null
    const password = null

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error if has no email', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = null
    const password = 'foobar'

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : email')
    })
  })

  it('should throw error if has no password', async () => {
    // mock
    const req = {
      nap: { errors: [] },
      body: {}
    }
    const email = 'katopz@gmail.com'
    const password = null

    const { willLogin } = require('../authen-local')
    await willLogin(req, email, password).catch(err => {
      expect(() => { throw err }).toThrow('Required : password')
    })
  })
  
  it('should login with user and password', async () => {
    // mock
    const req = {
      nap: { errors : [] },
      body: {}
    }
    const email = 'katopz@gmail.com'
    const password = 'foobar'

    const { willLogin } = require('../authen-local')
    const user = await willLogin(req, email, password)
    expect(user).toMatchSnapshot()
  })
})