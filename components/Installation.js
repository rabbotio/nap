import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import React from 'react'
import platform from 'platform'
import NAPClient from '../lib/NAPClient'

const Installation = ({ init }) => {
  // Install this device
  if (typeof (window) !== 'undefined') {
    init(platform.description)
      .then(result => {
        NAPClient.sessionToken = result.data.init.record.sessionToken
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
mutation init($info:CreateOneInstallationInput!){
  init(record: $info) {
    record {
      sessionToken
    }
  }
}
`

export default graphql(withInstallation, {
  props: ({ mutate }) => ({
    init: (deviceInfo) => mutate({
      variables: { info: { deviceInfo } },
    })
  })
})(Installation)
