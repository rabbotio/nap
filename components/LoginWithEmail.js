import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../lib/persist'
import device from '../lib/device'

const Login = ({ loginWithEmail }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    let deviceInfo = e.target.elements.deviceInfo.value
    let email = e.target.elements.email.value
    let password = e.target.elements.password.value

    if (deviceInfo === '' || email === '') {
      window.alert('Both fields are required.')
      return false
    }

    loginWithEmail(deviceInfo, email, password)

    // reset form
    e.target.elements.deviceInfo.value = ''
    e.target.elements.email.value = ''
    e.target.elements.password.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in with email/password (Token base)</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <input placeholder='password' name='password' defaultValue='bar' />
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
mutation loginWithEmail($deviceInfo: String!, $email: String!, $password: String) {
  loginWithEmail(deviceInfo: $deviceInfo, email: $email, password: $password) {
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

Login.propTypes = () => ({
  loginWithEmail: React.PropTypes.func.isRequired
})

export default graphql(loginWithEmail, {
  props: ({ mutate }) => ({
    loginWithEmail: (deviceInfo, email, password) => mutate({
      variables: { deviceInfo, email, password },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Guard
          if (mutationResult.data.errors.length > 0) {
            console.error(mutationResult.data.errors[0].message)
            return mutationResult.data.loginWithEmail
          }

          // Keep session
          mutationResult.data.loginWithEmail && persist.willSetSessionToken(mutationResult.data.loginWithEmail.sessionToken)

          // Provide user
          return mutationResult.data.loginWithEmail
        }
      }
    })
  })
})(Login)
