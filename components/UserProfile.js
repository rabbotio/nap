import { gql, graphql } from 'react-apollo'

function UserProfile({ data: { loading, currentUser }, errors }) {
  if (errors) {
    return <div>Error!</div>
  }

  if (loading) {
    return <div>Loading</div>
  }

  if (currentUser) {
    return <div>Hi!</div>
  }

  // Not loggedIn
  return (
    <div>
      <form onSubmit={this.submitForm}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="accessToken"
            value="EAABnTrZBSJyYBAKvcWAcAOUwt07ZCVxhCYQwKKWFZAwtOhsGYZAc7olL04W8eJTlxBeZCmxCQO9kYZA4kKtTD0zmZChhb5hEoZBl7JHT0Rx39uGP8ow2X9vGoTLFZCm4Dd0NFvH0qsHXNYinsOKjszfSJVOj3DZChv0MNszawr1le8O0ToqI3Ak9Jr8X3X6imEtvJ2q8ceeVh5Ux1rSbgypRQNRDjlredVXpIZD"
            onChange={this.handleChange}
          />
          <button type="submit">
            log in with Facebook
          </button>
        </div>
      </form>
    </div>
  )
}

const PROFILE_QUERY = gql`
query {
  userOne {
    name
  }
}
`;

export default graphql(PROFILE_QUERY, {
  options: { forceFetch: true },
  props: ({ data: { loading, currentUser }, errors }) => (
    { loading, currentUser, errors }
  ),
})(UserProfile);
