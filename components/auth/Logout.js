import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import React from 'react'
import userProfile from '../userProfile.gql'
import PropTypes from 'prop-types'

const Logout = ({ logout }) => {
  return (
    <button onClick={logout}>LogOut (GraphQL)</button>
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
  logout: PropTypes.func.isRequired
})

export default graphql(logout, {
  props: ({ mutate }) => ({
    logout: () => mutate({
      update: (proxy, { data }) => {
        // Clear session
        persist.willRemoveSessionToken()

        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Errors
        cached.errors = data.errors

        // User
        cached.user = data.logout.user

        // Authen
        cached.authen = {
          isLoggedIn: data.logout.isLoggedIn,
          sessionToken: data.logout.sessionToken,
          _typename: 'Authen'
        }

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(Logout)
