import { gql, graphql } from 'react-apollo'
import NAPSession from '../lib/NAPSession'
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
          NAPSession.willClearSessionToken()

          // Provide no user
          return { user: null, errors: [] }
        }
      }
    })
  })
})(Logout)
