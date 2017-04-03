require('./debug')

const defaultConfig = {
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
};

const init = (config = {}) => {
  let _config = Object.assign(
    {},
    defaultConfig,
    config
  );
  global.NAP = {};
  // Next
  const nextjs = require('next')({ dev: _config.dev })

  // Will apply middleware
  const initializer = require('./initializer')
  return nextjs.prepare().then(() => initializer(_config, nextjs)).catch(console.log)
}

module.exports = init
