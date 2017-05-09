import React from 'react'
import PropTypes from 'prop-types'
import { gql, graphql } from 'react-apollo'

const Forget = ({ forget }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    let email = e.target.elements.email.value

    if (email === '') {
      window.alert('Email fields are required.')
      return false
    }

    forget(email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Forget Password</h1>
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <button type='submit'>Forget</button>
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

const forget = gql`
mutation forget($email: String!) {
  forget(email: $email) {
    user {
      status
    }
  }
  errors {
    code
    message
  }
}
`

Forget.propTypes = () => ({
  forget: PropTypes.func.isRequired
})

export default graphql(forget, {
  props: ({ mutate }) => ({
    forget: (email) => mutate({
      variables: { email },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Guard
          if (mutationResult.data.errors.length > 0) {
            console.error(mutationResult.data.errors[0].message) // eslint-disable-line
            return mutationResult.data.forget
          }

          // Provide user
          return mutationResult.data.forget
        }
      }
    })
  })
})(Forget)
