import { gql, graphql } from 'react-apollo'
import React from 'react'
import Login from '../components/Login'
import LoginWithEmail from '../components/LoginWithEmail'
import Logout from '../components/Logout'

const UserProfile = ({ loading, user, errors }) => {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors)) // eslint-disable-line
  }

  if (loading) {
    return <div>Loading<hr/></div>
  }

  if (user) {
    return <div>Welcome : {user.name}<Logout/><hr/></div>
  }

  return <div><Login/><hr/><LoginWithEmail/></div>
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

export default graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors } }) => (
    { loading, user, errors }
  ),
})(UserProfile)
