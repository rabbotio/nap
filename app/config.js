const config = {}

config.redis = {
  url: process.env.REDIS_STORE_URI,
  secret: process.env.EXPRESS_SESSION_SECRET
}

config.mongo = {
  url: process.env.MONGO_URI
}

module.exports = config