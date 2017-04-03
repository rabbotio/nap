require('./debug')

const init = (config = {
  dev: true,
  mailgun_api_key: '',
  mailgun_domain: '',
  redis_url: 'redis://redis',
  mongo_url: 'mongodb://localhost:27077/graphql',
  port: 3000,
  cookie_secret: 'foo',
  jwt_secret: 'foo',
  passportEnabled: true,
  graphqlEnabled: true,
  graphqliqlEnabled: true,
}) => {
  global.NAP = {};
  // Next
  const nextjs = require('next')({ dev: config.dev })

  // Will apply middleware
  const initializer = require('./initializer')
  return nextjs.prepare().then(() => initializer(config, nextjs))
}

module.exports = init
