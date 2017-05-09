import React from 'react'
import Router from 'next/router'
import 'isomorphic-fetch'
import PropTypes from 'prop-types'

const resetPassword = (token, password) => fetch('/reset-password-by-token', {
  method: 'POST',
  body: JSON.stringify({ token, password }),
  headers: new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
}).then(response => response.json())

class Reset extends React.Component {
  static getInitialProps({ query: { token } }) {
    return { token }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const token = e.target.elements.token.value
    const password = e.target.elements.password.value

    if (token === '' || password === '') {
      window.alert('Both fields are required.')
      return false
    }

    resetPassword(token, password).then(json => {
      if (json.data.isReset) {
        return Router.push('/auth/reset-succeed')
      }
    }).catch(err => console.error(err))
  }

  render() {
    return <form onSubmit={this.handleSubmit}>
      <h1>Reset Password</h1>
      <input placeholder='token' name='token' defaultValue={this.props.token} /><br />
      <input placeholder='password' name='password' defaultValue='bar' />
      <button type='submit'>Reset</button>
      <style jsx>{`
      form {
        border-bottom: 1px solid #ececec
        padding-bottom: 20px
        margin-bottom: 20px
      }
      h1 {
        font-size: 20px
      }
      input {
        display: block
        margin-bottom: 10px
      }
      `}</style>
    </form>
  }
}

Reset.propTypes = () => ({
  resetPassword: PropTypes.func.isRequired
})

export default Reset
