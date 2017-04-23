import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import device from '../../lib/device'

const SignUp = ({ signup }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    let deviceInfo = e.target.elements.deviceInfo.value
    let email = e.target.elements.email.value
    let password = e.target.elements.password.value

    if (deviceInfo === '' || email === '') {
      window.alert('Both fields are required.')
      return false
    }

    signup(deviceInfo, email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>SignUp</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <input placeholder='password' name='password' defaultValue='barbar' />
      <button type='submit'>SignUp</button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  )
}

const signup = gql`
mutation signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    isLoggedIn
    sessionToken
    user {
      _id
      name
      status
    }
  }
  errors {
    code
    message
  }
}
`

SignUp.propTypes = () => ({
  signup: React.PropTypes.func.isRequired
})

export default graphql(signup, {
  props: ({ mutate }) => ({
    signup: (deviceInfo, email, password) => mutate({
      variables: { deviceInfo, email, password },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Guard
          if (mutationResult.data.errors.length > 0) {
            console.error(mutationResult.data.errors[0].message)
            return mutationResult.data.signup
          }

          // Keep session
          mutationResult.data.signup && persist.willSetSessionToken(mutationResult.data.signup.sessionToken)

          // Provide user
          return mutationResult.data.signup
        }
      }
    })
  })
})(SignUp)
