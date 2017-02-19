import React from 'react'
import Page from '../../components/auth/page'
import Layout from '../../components/auth/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Check your email</h2>
        <p>You have been sent an email with a link you can use to sign in.</p>
      </Layout>
    )
  }
}
