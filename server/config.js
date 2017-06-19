// Helper
const dev = process.env.NODE_ENV !== 'production'
const isTrue = (value) => {
  switch (value) {
    case true: return true
    case 'true': return true
    case 1: return true
    case '1': return true
    default: return false
  }
}

const config = {
  // Environments
  dev,

  // Passport
  mailgun_api_key: process.env.MAILGUN_API_KEY,
  mailgun_domain: process.env.MAILGUN_DOMAIN,

  // Services
  redis_url: process.env.REDIS_URI || 'redis://redis',
  mongo_url: process.env.MONGODB_URI || 'mongodb://mongo/graphql',
  port: parseInt(process.env.PORT || '0') || 3000,

  // Security
  cookie_secret: process.env.COOKIE_SECRET || 'foo',
  jwt_secret: process.env.JWT_SECRET || 'foo',

  next_disabled: isTrue(process.env.NEXT_DISABLED),
  passport_disabled: isTrue(process.env.PASSPORT_DISABLED),
  graphql_disabled: isTrue(process.env.GRAPHQL_SERVER_DISABLED),
  graphiql_enabled: dev || isTrue(process.env.GRAPHIQL_ENABLED),

  mubsub: process.env.MUBSUB_URI,
  mubsub_enabled: process.env.MUBSUB_URI !== undefined && !!process.env.MUBSUB_URI,
}

module.exports = config
