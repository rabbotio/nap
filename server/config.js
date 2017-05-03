// Helper
const bool = (str) => (str == void 0) ? false : str.toLowerCase() === 'true' // eslint-disable-line
const int = (str) => (!str) ? 0 : parseInt(str, 10) // eslint-disable-line
const float = (str) => (!str) ? 0: parseFloat(str, 10)  // eslint-disable-line

const dev = process.env.NODE_ENV !== 'production';

const config = {
  // Environments
  dev,

  // Passport
  mailgun_api_key: process.env.MAILGUN_API_KEY,
  mailgun_domain: process.env.MAILGUN_DOMAIN,

  // Services
  redis_url: process.env.REDIS_URI || 'redis://redis',
  mongo_url: process.env.MONGODB_URI || 'mongodb://mongo/graphql',
  port: int(process.env.PORT) || 3000,

  // Security
  cookie_secret: process.env.COOKIE_SECRET || 'foo',
  jwt_secret: process.env.JWT_SECRET || 'foo',
  
  passport_disabled: int(process.env.PASSPORT_DISABLED || '0') === 1,
  graphql_disabled: int(process.env.GRAPHQL_SERVER_DISABLED || '0') === 1,
  graphiql_enabled: process.env.GRAPHIQL_ENABLED !== undefined ? int(process.env.GRAPHIQL_ENABLED) === 1 : dev,

  mubsub: process.env.MUBSUB_URI,
  mubsub_enabled: process.env.MUBSUB_URI !== undefined && !!process.env.MUBSUB_URI,
};

module.exports = config;
