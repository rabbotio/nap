import { ApolloProvider, getDataFromTree } from 'react-apollo'
import React from 'react'
import 'isomorphic-fetch'
import { initClient } from './initClient'
import { initStore } from './initStore'
import Session from '../components/auth/session'

export default (Component) => (
  class extends React.Component {
    static propTypes = () => ({
      headers: React.PropTypes.object.isRequired,
      initialState: React.PropTypes.object.isRequired
    })

    static async getInitialProps(ctx) {
      // For cookie flow authen
      const _session = new Session({ctx})
      const session = await _session.getSession()
      console.log('session:', session)
      
      const headers = ctx.req ? ctx.req.headers : {}
      const client = initClient(headers)
      const store = initStore(client, client.initialState)

      const props = {
        url: { query: ctx.query, pathname: ctx.pathname },
        ...await (Component.getInitialProps ? Component.getInitialProps(ctx) : {}),
        session
      }

      if (!process.browser) {
        const app = (
          <ApolloProvider client={client} store={store}>
            <Component {...props} />
          </ApolloProvider>
        )
        await getDataFromTree(app)
      }

      const state = store.getState()
      return {
        initialState: {
          ...state,
          apollo: {
            data: state.apollo.data
          }
        },
        headers,
        ...props
      }
    }

    constructor(props) {
      super(props)
      this.client = initClient(this.props.headers)
      this.store = initStore(this.client, this.props.initialState)
    }

    render() {
      return (
        <ApolloProvider client={this.client} store={this.store}>
          <Component {...this.props} />
        </ApolloProvider>
      )
    }
  }
)
