// Helper
const bool = (str) => (str == void 0) ? false : str.toLowerCase() === 'true' // eslint-disable-line
const int = (str) => (!str) ? 0 : parseInt(str, 10) // eslint-disable-line
const float = (str) => (!str) ? 0: parseFloat(str, 10)  // eslint-disable-line

global.NAP = global.NAP ? global.NAP : {}
global.NAP.Config = {
  // Passport
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,

  // Services
  redis_url: process.env.REDIS_URI || 'redis://redis',
  mongo_url: process.env.MONGODB_URI || 'mongodb://mongo/graphql',
  port: int(process.env.PORT) || 3000,

  // Security
  cookie_secret: process.env.COOKIE_SECRET || 'foo',
}