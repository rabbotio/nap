import { gql, graphql } from 'react-apollo'
import persist from '../lib/persist'
import React from 'react'

const Logout = ({ logout }) => {
  return (
    <button onClick={logout}>LogOut</button>
  )
}

const loginWithFacebook = gql`
mutation logout {
  logout {
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

export default graphql(loginWithFacebook, {
  props: ({ mutate }) => ({
    logout: () => mutate({
      updateQueries: {
        userProfile: () => {
          // Clear session
          persist.willClearSessionToken()

          // Provide no user
          return { user: null, errors: [] }
        }
      }
    })
  })
})(Logout)
