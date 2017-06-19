require('./debug')
const config = require('./config')

const start = () => {
  // NAP
  global.NAP = {}

  // Components  
  const initializer = require('./initializer')

  // Next disabled?
  if (config.next_disabled) {
    initializer(config)
    return
  }

  // Next
  const nextjs = require('next')({ dev: config.dev })

  // Will apply middleware
  nextjs.prepare().then(() => initializer(config, nextjs))
}

module.exports = {
  start,
}
