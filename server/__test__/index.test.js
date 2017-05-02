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

  it('has GraphQL', async () => {
    await fetcher().then(res => expect(res).toMatchSnapshot())
  })

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
    variables: `{"deviceInfo": "foo", "accessToken": "EAAZA7qxaGBBABAEEZALz9Hg33lZBZBkWV1pY6USZCVbhtdZAIJIJZBpflfGoSJc3RjNZBZC7E4OussiFRGkLpGrlrkQPP5g0up8I3lou1sM7Orl6DaNj24qp5nmOLCk06UtxOAPkFD6qZCPA5rb3TnHCpD88Jqad7BeREUzcdLpOnSj1a8uaEIVRbUpGQ8C1j7k7wxQtwhOAzSsn3OaPcDHlqBHSjNEgpqx8thBxvvJnWfyQZDZD"}`
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
              "name": "David Thuns"
            }
          },
          "errors": []
        }
      })
    })
  })

  it('can log user out', async () => {
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

    await fetcher(query, authorization).then(result => {
      expect(result).toMatchObject({
        "data": {
          "logout": {
            "loggedOutAt": expect.any(String),
            "isLoggedIn": false,
          },
          "errors": []
        }
      })
    })
  })

})