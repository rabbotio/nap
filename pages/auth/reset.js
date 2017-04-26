import React from 'react'
import Router from 'next/router'

const resetPassword = (token, password) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  xhr.open('POST', '/reset-password-by-token')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.onload = () => {
    if (xhr.readyState === 4) {
      resolve(xhr.response)
    }
  }
  xhr.send(JSON.stringify({ token, password }))
})

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
      <input placeholder='password' name='password' defaultValue='barbar' />
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
  resetPassword: React.PropTypes.func.isRequired
})

export default Reset
