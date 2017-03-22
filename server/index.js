require('./debug')
require('./config')

const init = () => {
  // Config
  const config = global.NAP.Config

  // Next
  const nextjs = require('next')({ dev: config.dev })

  // Will apply middleware
  const initializer = require('./initializer')
  return nextjs.prepare().then(() => initializer(config, nextjs))
}

module.exports = init
