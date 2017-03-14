import ApolloClient, { createNetworkInterface } from 'apollo-client'
import NAPSession from '../lib/NAPSession'

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
    (async () => {
      const token = await NAPSession.willGetSessionToken()
      req.options.headers.authorization = token ? `Bearer ${token}` : null
      next()
    })()
  }
}])

let apolloClient = null

const createClient = headers => {
  return new ApolloClient({
    ssrMode: !process.browser,
    headers,
    dataIdFromObject: result => result.id || null,
    networkInterface
  })
}

export const initClient = headers => {
  if (!process.browser) {
    return createClient(headers)
  }
  if (!apolloClient) {
    apolloClient = createClient(headers)
  }
  return apolloClient
}
