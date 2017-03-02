import App from '../components/App'
import Installation from '../components/Installation'
import Header from '../components/Header'
import Submit from '../components/Submit'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Installation />
    <Header pathname={props.url.pathname} />
    <Submit />
  </App>
))
