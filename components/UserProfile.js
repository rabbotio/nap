import { gql, graphql, withApollo } from 'react-apollo'
import React from 'react'
import Login from '../components/Login'
import Logout from '../components/Logout'

const UserProfile = ({ loading, user, errors }) => {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors)) // eslint-disable-line
  }

  if (loading) {
    return <div>Loading</div>
  }

  if (user) {
    return <div>{user.name}<Logout/></div>
  }

  return <Login/>
}

const userProfile = gql`
query userProfile {
  user {
    name
  }
  errors {
    code
    message
  }
}
`


export default withApollo(graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors } }) => (
    { loading, user, errors }
  ),
})(UserProfile))
