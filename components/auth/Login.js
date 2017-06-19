import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import device from '../../lib/device'
import userProfile from '../userProfile.gql'
import PropTypes from 'prop-types'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceInfo: ''
    }
    this.login = props.login
  }

  handleSubmit(e) {
    e.preventDefault()

    const deviceInfo = e.target.elements.deviceInfo.value
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value

    if (deviceInfo === '' || email === '' || password === '') {
      window.alert('All fields are required.')
      return false
    }

    this.login(deviceInfo, email, password)

    // reset form
    e.target.elements.deviceInfo.value = ''
    e.target.elements.email.value = ''
    e.target.elements.password.value = ''
  }

  componentDidMount() {
    this.setState({ deviceInfo: device.info() })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h1>Login (GraphQL)</h1>
        <input placeholder='deviceInfo' name='deviceInfo' value={this.state.deviceInfo} />
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
    installation {
      _id
      deviceInfo
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
        if (data.login) {
          cached.user = data.login.user

          // Authen
          cached.authen = {
            isLoggedIn: data.login.isLoggedIn,
            sessionToken: data.login.sessionToken,
            __typename: 'Authen'
          }
        }

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(Login)
