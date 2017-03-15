import App from '../components/App'
import Header from '../components/Header'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} sessionToken={props.sessionToken}/>
  </App>
))
