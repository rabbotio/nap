// Default
process.env.HTTP_PORT = process.env.HTTP_PORT || 3000
process.env.REDIS_SESSION_URI = process.env.REDIS_SESSION_URI || `redis://redis`
process.env.MONGODB_URI = process.env.MONGODB_URI || `mongodb://mongo/graphql`

require('dotenv').config()
require("./server")()