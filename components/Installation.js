import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import React from 'react'
import platform from 'platform'

const Installation = ({ init }) => {
  // Install this device
  if(typeof(window) !== 'undefined') {
    init(platform.description)
    .then(result => {
      console.log(result.data.init.record.deviceInfo)
    }, error => {
      console.log(error)
    }).catch(err => {
      console.error(err)
    })

    return (<div>Installed</div>)
  } else {
    return (<div>Installing...</div>)
  }
}

Installation.propTypes = {
  init: React.PropTypes.func.isRequired
}

const withInstallation = gql`
mutation init($info:CreateOneInstallationInput!){
  init(record: $info) {
    record {
      deviceInfo
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
