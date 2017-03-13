import App from '../components/App'
import Header from '../components/Header'
import Submit from '../components/Submit'
import withData from '../lib/withData'
import UserProfile from '../components/UserProfile'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <Submit />
    <UserProfile/>
  </App>
))
