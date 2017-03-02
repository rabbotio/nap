import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import React from 'react'
import platform from 'platform'

const Installation = ({ createInstallation }) => {
  createInstallation(platform.name + ' ' + platform.version)
  return (
    <div>Installed</div>
  )
}

Installation.propTypes = {
  createInstallation: React.PropTypes.func.isRequired
}

const createInstallation = gql`
mutation init($info:CreateOneInstallationInput!){
  init(record: $info) {
    record {
      deviceName
    }
  }
}
`

export default graphql(createInstallation, {
  props: ({ mutate }) => ({
    createInstallation: (deviceName) => mutate({
      variables: { info: { deviceName } },
    })
  })
})(Installation)
