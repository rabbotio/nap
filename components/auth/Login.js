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
      <h1>Login</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <input placeholder='password' name='password' defaultValue='bar' />
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
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Guard
          if (mutationResult.data.errors.length > 0) {
            alert(mutationResult.data.errors[0].message)
            return mutationResult.data.login
          }

          // Keep session
          mutationResult.data.login && persist.willSetSessionToken(mutationResult.data.login.sessionToken)

          // Provide user
          return mutationResult.data.login
        }
      },
      update: (proxy, { data }) => {
        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Modify it
        if (cached && cached.authen) {
          cached.authen.isLoggedIn = data.login ? data.login.isLoggedIn : false
          cached.authen.sessionToken = data.login ? data.login.sessionToken : null
        }

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(Login)
