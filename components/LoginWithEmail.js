import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../lib/persist'
import device from '../lib/device'

const Login = ({ loginWithEmail }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    let deviceInfo = e.target.elements.deviceInfo.value
    let email = e.target.elements.email.value

    if (deviceInfo === '' || email === '') {
      window.alert('Both fields are required.')
      return false
    }

    loginWithEmail(deviceInfo, email)

    // reset form
    e.target.elements.deviceInfo.value = ''
    e.target.elements.email.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in email</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <button type='submit'>Log in with email</button>
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

const loginWithEmail = gql`
mutation loginWithEmail($deviceInfo: String!, $email: String!) {
  loginWithEmail(deviceInfo: $deviceInfo, email: $email) {
    sessionToken
    user {
      _id
      status
    }
  }
  errors {
    code
    message
  }
}
`

Login.propTypes = () => ({
  loginWithEmail: React.PropTypes.func.isRequired
})

export default graphql(loginWithEmail, {
  props: ({ mutate }) => ({
    loginWithEmail: (deviceInfo, email) => mutate({
      variables: { deviceInfo, email },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Keep session
          persist.willSetSessionToken(mutationResult.data.loginWithEmail.sessionToken)

          // Provide user
          return mutationResult.data.loginWithEmail
        }
      }
    })
  })
})(Login)
