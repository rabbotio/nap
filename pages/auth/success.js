import Link from 'next/link'
import React from 'react'
import Page from '../../components/auth/page'
import Layout from '../../components/auth/layout'
import Session from '../../components/auth/session'

export default class extends Page {

  async componentDidMount() {
    // const session = new Session()
    // await session.getSession(true)
    // this.props.url.push('/')
  }

  render() {
    return (
      <Layout session={this.props.session}>
        <div style={{textAlign: 'center'}}>
          <p>You are now signed in. :D</p>
          <p><Link href="/"><a>Continue</a></Link></p>
        </div>
      </Layout>
    )
  }

}
