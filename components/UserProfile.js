import { gql, graphql } from 'react-apollo'

function UserProfile({ loading, user, errors }) {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors))
  }

  if (loading) {
    return <div>Loading</div>
  }

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsYXRpb25JZCI6IjU4YzYzMjc3MWNmZTQ2MDEwMzJlMDI1MyIsInVzZXJJZCI6IjU4YzE0MzE5ZjU2MGRiNzJlOGIxMmQ4NSIsImNyZWF0ZWRBdCI6IjIwMTctMDMtMTNUMDU6NDc6MzYuMDgwWiIsImlhdCI6MTQ4OTM4NDA1Nn0.rrcZZAnkagACx8LEKsfLkeV5bEfxeAQcdB1wduONj5U
  if (user) {
    return <div>{user.name}</div>
  }

  console.log(user)

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
`;

export default graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors } }) => (
    { loading, user, errors }
  ),
})(UserProfile);
