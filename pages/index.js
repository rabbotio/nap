import App from '../components/App'
import Header from '../components/Header'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname}/>
    <article><h1>Home sweet home!</h1>
    <img src='https://github.com/rabbotio/nap/raw/master/art/nap-logo.png' />
    </article>
  </App>
))
