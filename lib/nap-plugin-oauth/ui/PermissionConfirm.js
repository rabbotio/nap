import React from 'react'
import Router from 'next/router'


export default ({persist}) => class PermissionConfirm extends React.Component {
    static getInitialProps(ctx) {
        if(typeof window === 'undefined') {
            return {...ctx.req.query}
        } else {
           
            return { token, ...Router.query}
        }
        return  {  }
    }
   constructor(props) {
        super(props)
        this.state = {
            token: ''
        }
    }
    async componentDidMount() {
        const token = await persist.willGetSessionToken()
        if(!this.props.app_id || !this.props.callback_url || !token) {
            Router.push('/')
        }
        this.setState(() => ({token}))
    }
    render() {
        return (
            <div>
                <h1>{'Login with NAP'}</h1>
                <p><b>{`${this.props.app_id}`}</b>{` want to access your login session`}</p>
                <form action={this.props.callback_url} method="POST" >
                    <input type="hidden" name="token" value={this.state.token} />
                    <input type="submit" value="Confirm" />
                </form>
            </div>
        )
    }
}