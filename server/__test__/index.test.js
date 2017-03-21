/* eslint-env jest */
require('../debug')
const { SESSION_EMPTY } = require('../errors')

describe('index', () => {

  const fetcher = async (body) => {
    const fetch = require('isomorphic-fetch')
    return await fetch('http://localhost:3000/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body
    }).then(response => response.json())
  }

  test('is has GraphQL', async () => {
    await fetcher().catch(err => {
      expect(err).toMatchObject({
        "errors": [{ "message": "Must provide query string.", "stack": null }]
      })
    })
  })

  test('is can log user in with Facebook token', async () => {
    const loginWithFacebook = {
      operationName: 'loginWithFacebook',
      query: `
      mutation loginWithFacebook($deviceInfo: String!, $accessToken: String!) {
        loginWithFacebook(deviceInfo: $deviceInfo, accessToken: $accessToken) {
          sessionToken
          user {
            _id
            name
          }
        }
        errors {
          code
          message
        }
      }
      `,
      variables: `{"deviceInfo": "foo", "accessToken": "EAABnTrZBSJyYBAKvcWAcAOUwt07ZCVxhCYQwKKWFZAwtOhsGYZAc7olL04W8eJTlxBeZCmxCQO9kYZA4kKtTD0zmZChhb5hEoZBl7JHT0Rx39uGP8ow2X9vGoTLFZCm4Dd0NFvH0qsHXNYinsOKjszfSJVOj3DZChv0MNszawr1le8O0ToqI3Ak9Jr8X3X6imEtvJ2q8ceeVh5Ux1rSbgypRQNRDjlredVXpIZD"}`
    }

    const query = JSON.stringify(loginWithFacebook)

    await fetcher(query).then(result => {
      expect(result).toMatchObject({
        "data": {
          "loginWithFacebook": {
            "sessionToken": expect.any(String),
            "user": {
              "_id": expect.any(String),
              "name": "Katopz Todsaporn"
            }
          },
          "errors": [SESSION_EMPTY]
        }
      })
    })
  })

})