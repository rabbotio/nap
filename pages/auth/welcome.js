import React from 'react'
import Link from 'next/link'
import 'isomorphic-fetch'
import persist from '../../lib/persist'
import PropTypes from 'prop-types'

class welcome extends React.Component {
  static async getInitialProps(context) {
    const { req } = context

    // Guard
    if (!req) {
      return {}
    }

    if (!req.user) {
      return {}
    }

    // Get access token if has
    const user = await NAP.User.findOne({ _id: req.user.id })

    // Guard
    if (!user) {
      return {}
    }

    // Get session token if has
    const authen = await NAP.Authen.findOne({ userId: user.id })

    // Guard : User not authen yet, will use data from user's collection instead    
    if (!authen) {
      return {
        userName: user.name,
        accessToken: user.facebook.token
      }
    }

    // Use authen collection data
    return {
      userName: user.name,
      sessionToken: authen.sessionToken,
      accessToken: authen.accessToken
    }
  }

  validateSessionState({ sessionToken, accessToken }) {
    // Guard
    if (!accessToken) {
      return <p>You are not logged in with facebook</p>
    }

    // Keep it    
    persist.willSetAccessToken(accessToken)

    // Guard
    if (!sessionToken) {
      return <div>
        <p>You are now logged in but will need session token for GraphQL access.</p>
        <p>Please go home and do login with Facebook via GraphQL to get one.</p>
      </div>
    }

    // Keep it
    persist.willSetSessionToken(sessionToken)

    // Yell    
    return <p>You are now login with session token : {sessionToken}</p>
  }

  render() {
    return (
      <div>
        <p>Welcome! {this.props.userName}</p>
        {this.validateSessionState(this.props)}
        <Link prefetch href='/'><a>Go home</a></Link>
      </div>
    )
  }
}

welcome.propTypes = () => ({
  userName: PropTypes.string,
  sessionToken: PropTypes.string,
  accessToken: PropTypes.string
})

export default welcome