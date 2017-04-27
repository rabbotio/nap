import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import React from 'react'
import userProfile from '../userProfile.gql'

const Logout = ({ logout }) => {
  return (
    <button onClick={logout}>LogOut</button>
  )
}

const logout = gql`
mutation logout {
  logout {
    isLoggedIn
    loggedOutAt
  }
  errors {
    code
    message
  }
}
`

Logout.propTypes = () => ({
  logout: React.PropTypes.func.isRequired
})

export default graphql(logout, {
  props: ({ mutate }) => ({
    logout: () => mutate({
      updateQueries: {
        userProfile: () => {
          // Clear session
          persist.willRemoveSessionToken()

          // Provide no user
          return { user: null, errors: [], isLoggedIn: false, sessionToken: null }
        },
        update: (proxy) => {
          // Read the data from our cache for this query.
          let cached = proxy.readQuery({ query: userProfile })

          // Modify it
          if (cached && cached.authen) {
            cached.authen.isLoggedIn = false
            cached.authen.sessionToken = null
          }

          cached.user = null

          // Write our data back to the cache.
          proxy.writeQuery({ query: userProfile, data: cached })
        }
      }
    })
  })
})(Logout)
