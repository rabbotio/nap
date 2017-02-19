import Link from 'next/prefetch'
import React from 'react'
import Page from '../../components/auth/page'
import Layout from '../../components/auth/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Unable to sign in</h2>
        <p>The link you tried to use to sign in was not valid.</p>
        <p><Link href="/auth/signin"><a>Request a new one to sign in.</a></Link></p>
      </Layout>
    )
  }
}
