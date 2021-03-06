import { graphql } from 'react-apollo'
import React from 'react'
import LoginWithFacebook from '../components/auth/LoginWithFacebook'
import SignUp from '../components/auth/SignUp'
import Login from '../components/auth/Login'
import Logout from '../components/auth/Logout'
import Forget from '../components/auth/Forget'
import userProfile from './userProfile.gql'
import PropTypes from 'prop-types'

const UserProfile = ({ loading, user, errors, authen }) => {
  if (loading) {
    return <div>Loading<hr /></div>
  }

  // Logged in
  if (authen && authen.isLoggedIn) {
    if (user) {
      return <div>Welcome : {user.name}<Logout /><hr /></div>
    }
  }

  // Not logged in
  let info = errors && errors[0] ? errors[0].message : ''
  if (user) {
    switch (user.status) {
      case 'WAIT_FOR_EMAIL_VERIFICATION':
      case 'WAIT_FOR_EMAIL_RESET':
        info = 'Please check you email'
        break
    }
  }
  return <div>
    <p className='error'>{info}</p><LoginWithFacebook /><hr /><SignUp /><hr /><Login /> <Forget />
    <style jsx>{`
      .error {
        color: #ff0000
      }
      `}</style>
  </div>
}

UserProfile.propTypes = () => ({
  loading: PropTypes.boolean.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  authen: PropTypes.object.isRequired,
})

export default graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors, authen } }) => (
    { loading, user, errors, authen }
  )
})(UserProfile)
