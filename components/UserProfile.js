import { gql, graphql } from 'react-apollo'
import React from 'react'
import LoginWithFacebook from '../components/auth/LoginWithFacebook'
import SignUp from '../components/auth/SignUp'
import Login from '../components/auth/Login'
import Logout from '../components/auth/Logout'

const UserProfile = ({ loading, user, errors }) => {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors)) // eslint-disable-line
  }

  console.log(loading, user, errors)

  if (loading) {
    return <div>Loading<hr /></div>
  }

  if (user) {
    switch (user.status) {
      case 'VERIFIED_BY_EMAIL_AND_PASSWORD':
        return <div>Welcome : {user.name}<Logout /><hr /></div>
      default:
        if(user.name){
          return <div>Welcome : {user.name}<Logout /><hr /></div>
        }
      break
    }
  }
  return <div><LoginWithFacebook /><hr /><SignUp /><hr /><Login /></div>
}

const userProfile = gql`
query userProfile {
  user {
    _id
    name
    status
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
