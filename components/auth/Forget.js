import React from 'react'
import PropTypes from 'prop-types'
import { gql, graphql } from 'react-apollo'
import userProfile from '../userProfile.gql'

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
      <h1>Forget Password (GraphQL)</h1>
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
    status
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
      update: (proxy, { data }) => {
        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Errors
        cached.errors = data.errors

        // User
        cached.user = cached.user || { _id: null, name: null, status: null, __typename: 'User' }
        cached.user.status = data.forget.status

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(Forget)
