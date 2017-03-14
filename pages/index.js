import App from '../components/App'
import Header from '../components/Header'
import Login from '../components/Login'
import Logout from '../components/Logout'
import withData from '../lib/withData'
import UserProfile from '../components/UserProfile'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <Login />
    <UserProfile/>
    <Logout />
  </App>
))
