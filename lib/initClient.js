import ApolloClient, { createNetworkInterface } from 'apollo-client'
import persist from './persist'

const _initNetworkInterface = graphql_url => {
  const networkInterface = createNetworkInterface({
    uri: graphql_url,
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
        const token = await persist.willGetSessionToken()
        req.options.headers.authorization = token ? `Bearer ${token}` : null
        next()
      })()
    }
  }])

  return networkInterface
}

let apolloClient = null

const createClient = (headers, graphql_url) => {
  return new ApolloClient({
    ssrMode: !process.browser,
    headers,
    dataIdFromObject: result => result.id || null, 
    networkInterface: _initNetworkInterface(graphql_url)
  })
}

export const initClient = (headers, graphql_url) => {
  if (!process.browser) {
    return createClient(headers, graphql_url)
  }
  if (!apolloClient) {
    apolloClient = createClient(headers, graphql_url)
  }
  return apolloClient
}
