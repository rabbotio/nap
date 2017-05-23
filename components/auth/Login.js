import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import device from '../../lib/device'
import userProfile from '../userProfile.gql'
import PropTypes from 'prop-types'

const Login = ({ login }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const deviceInfo = e.target.elements.deviceInfo.value
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value

    if (deviceInfo === '' || email === '' || password === '') {
      window.alert('All fields are required.')
      return false
    }

    login(deviceInfo, email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login (GraphQL)</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <input placeholder='password' name='password' defaultValue='foobar' />
      <button type='submit'>Login</button>
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

const login = gql`
mutation login($deviceInfo: String!, $email: String!, $password: String!) {
  login(deviceInfo: $deviceInfo, email: $email, password: $password) {
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

Login.propTypes = () => ({
  login: PropTypes.func.isRequired
})

export default graphql(login, {
  props: ({ mutate }) => ({
    login: (deviceInfo, email, password) => mutate({
      variables: { deviceInfo, email, password },
      update: (proxy, { data }) => {
        // Keep session
        data.login && persist.willSetSessionToken(data.login.sessionToken)

        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Errors
        cached.errors = data.errors

        // User
        cached.user = data.login.user

        // Authen
        cached.authen = {
          isLoggedIn: data.login.isLoggedIn,
          sessionToken: data.login.sessionToken,
          _typename: 'Authen'
        }

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(Login)
