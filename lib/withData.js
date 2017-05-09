import { ApolloProvider, getDataFromTree } from 'react-apollo'
import React from 'react'
import 'isomorphic-fetch'
import { initClient } from './initClient'
import { initStore } from './initStore'

export default (Component) => (
  class extends React.Component {
    static propTypes = () => ({
      headers: React.PropTypes.object.isRequired,
      graphql_url: React.PropTypes.object.isRequired,
      initialState: React.PropTypes.object.isRequired
    })

    static async getInitialProps(ctx) {
      const headers = ctx.req ? ctx.req.headers : {}
      const graphql_url = ctx.req ? `${ctx.req.protocol}://${ctx.req.headers.host}/graphql` : '/graphql'
      const client = initClient(headers, graphql_url)
      const store = initStore(client, client.initialState)

      const props = {
        url: { query: ctx.query, pathname: ctx.pathname },
        ...await (Component.getInitialProps ? Component.getInitialProps(ctx) : {}),
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
        graphql_url,
        ...props
      }
    }

    constructor(props) {
      super(props)

      this.client = initClient(this.props.headers, this.props.graphql_url)
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
