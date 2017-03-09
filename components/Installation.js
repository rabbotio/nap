import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import React from 'react'
import platform from 'platform'
// import NAPClient from '../lib/NAPClient'

const Installation = ({ init }) => {
  //
  const info = {
    // Devices
    deviceInfo: platform.description,
  }
  
  // At client
  if (typeof (window) !== 'undefined') {
    init(info).then(result => {

      console.log(result.data)

    }, error => {
      debug.error(error)
    }).catch(err => {
      debug.error(err)
    })
  }

  return <div></div>
}

Installation.propTypes = {
  init: React.PropTypes.func.isRequired
}

const withInstallation = gql`
mutation {
  loginWithFacebook(deviceInfo: "bar", accessToken: "FAABnTrZBSJyYBAKvcWAcAOUwt07ZCVxhCYQwKKWFZAwtOhsGYZAc7olL04W8eJTlxBeZCmxCQO9kYZA4kKtTD0zmZChhb5hEoZBl7JHT0Rx39uGP8ow2X9vGoTLFZCm4Dd0NFvH0qsHXNYinsOKjszfSJVOj3DZChv0MNszawr1le8O0ToqI3Ak9Jr8X3X6imEtvJ2q8ceeVh5Ux1rSbgypRQNRDjlredVXpIZD") {
    sessionToken
    user {
      name
    }
  }
}`

export default graphql(withInstallation, {
  props: ({ mutate }) => ({
    init: info => mutate({
      variables: { info },
    })
  })
})(Installation)
