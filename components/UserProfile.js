import { gql, graphql } from 'react-apollo'
import React from 'react'

const UserProfile = ({ loading, user, errors }) => {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors))
  }

  if (loading) {
    return <div>Loading</div>
  }

  if (user) {
    return <div>{user.name}</div>
  }

  return <div>Hmm?</div>
}

const userProfile = gql`
query userProfile {
  user {
    name
  }
  errors {
    code
    message
  }
}
`

UserProfile.propTypes = () => ({
  loading: React.PropTypes.boolean.isRequired,
  user: React.PropTypes.object.isRequired,
  errors: React.PropTypes.object.isRequired,
})

export default graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors } }) => (
    { loading, user, errors }
  ),
})(UserProfile)
