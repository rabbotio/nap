import ApolloClient, { createNetworkInterface } from 'apollo-client'
import NAPClient from '../lib/NAPClient'

const networkInterface = createNetworkInterface({
      uri: 'http://localhost:3000/graphql',
      opts: {
        credentials: 'same-origin'
      }
    })

// Authen
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}  // Create the header object if needed.
    }

    // get the authentication token from local storage if it exists
    console.info('r-NAPClient.sessionToken:', NAPClient.sessionToken)
    const token = process.browser ? NAPClient.sessionToken : null
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    console.info('token:', token)
    next()
  }
}])

let apolloClient = null

function createClient (headers) {
  return new ApolloClient({
    ssrMode: !process.browser,
    headers,
    dataIdFromObject: result => result.id || null,
    networkInterface
  })
}

export const initClient = (headers) => {
  if (!process.browser) {
    return createClient(headers)
  }
  if (!apolloClient) {
    apolloClient = createClient(headers)
  }
  return apolloClient
}
