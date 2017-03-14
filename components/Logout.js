import { gql, graphql } from 'react-apollo'
import NAPClient from '../lib/NAPClient'
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
        userProfile: (previousResult, { mutationResult }) => {
          // FYI
          console.info(mutationResult)

          // Keep session
          NAPClient.sessionToken = null

          // Provide no user
          return null
        }
      }
    })
  })
})(Logout)
