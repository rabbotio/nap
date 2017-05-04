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
          return { user: null, errors: [], authen: { isLoggedIn: false } }
        },
        update: (proxy) => {
          // Read the data from our cache for this query.
          let data = proxy.readQuery({ query: userProfile })

          // Modify it
          if (data && data.authen) {
            data.authen.isLoggedIn = false
            data.user = null
          }

          // Write our data back to the cache.
          proxy.writeQuery({ query: userProfile, data })
        }
      }
    })
  })
})(Logout)
