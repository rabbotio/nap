/* eslint-env jest */
require('../debug')

describe('index', () => {

  const fetcher = async (body, authorization) => {
    const fetch = require('isomorphic-fetch')
    return await fetch('http://localhost:3000/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/json', authorization },
      body
    }).then(response => response.json())
  }

  const loginWithFacebook = {
    operationName: 'loginWithFacebook',
    query: `mutation loginWithFacebook($deviceInfo: String!, $accessToken: String!) {
      loginWithFacebook(deviceInfo: $deviceInfo, accessToken: $accessToken) {
        isLoggedIn
        sessionToken
        user {
          _id
          name
          status
        }
      }
      errors {
        code
        message
      }
    }`,
    variables: `{"deviceInfo": "foo", "accessToken": "EAABnTrZBSJyYBAKvcWAcAOUwt07ZCVxhCYQwKKWFZAwtOhsGYZAc7olL04W8eJTlxBeZCmxCQO9kYZA4kKtTD0zmZChhb5hEoZBl7JHT0Rx39uGP8ow2X9vGoTLFZCm4Dd0NFvH0qsHXNYinsOKjszfSJVOj3DZChv0MNszawr1le8O0ToqI3Ak9Jr8X3X6imEtvJ2q8ceeVh5Ux1rSbgypRQNRDjlredVXpIZD"}`
  }

  it('can log user in with Facebook token', async () => {
    const query = JSON.stringify(loginWithFacebook)

    await fetcher(query).then(result => {
      const sessionToken = result.data.loginWithFacebook.sessionToken
      expect(result).toMatchObject({
        "data": {
          "loginWithFacebook": {
            sessionToken,
            "user": {
              "_id": expect.any(String),
              "name": expect.any(String),
            }
          },
          "errors": null
        }
      })
    })
  })

  it('can log user out and return null user', async () => {
    // Login first
    const loginWithFacebook_query = JSON.stringify(loginWithFacebook)
    const sessionToken = await fetcher(loginWithFacebook_query).then(result => result.data.loginWithFacebook.sessionToken)

    // Then logout
    const logout = {
      query: `
mutation {
  logout {
    loggedOutAt
    isLoggedIn
  }
  errors {
    code
    message
  }
}`,
      variables: null
    }

    const query = JSON.stringify(logout)
    const authorization = `Bearer ${sessionToken}`

    const result = await fetcher(query, authorization)
    expect(result).toMatchObject({
      "data": {
        "logout": {
          "loggedOutAt": expect.any(String),
          "isLoggedIn": false,
        },
        "errors": null
      }
    })

    const userProfile = {
      query: `query {
        authen {
          isLoggedIn
        }
        user {
          _id
          name
          status
        }
        errors {
          code
          message
        }
      }`,
      variables: null
    }

    const userProfile_query = JSON.stringify(userProfile)
    const userProfile_result = await fetcher(userProfile_query)
    expect(userProfile_result).toMatchObject({
      "data": {
        "authen": {
          "isLoggedIn": false,
        },
        "errors": [
          {
            "code": 0,
            "message": "No session found"
          }
        ],
        "user": null
      }
    })
  })
})