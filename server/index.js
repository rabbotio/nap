require('./debug')
const config = require('./config')

const start = async () => {
  // NAP
  global.NAP = {}

  // Next and else
  const nextjs = await require('./initNext')(config)
  const initializer = require('./initializer')
  await initializer(config, nextjs)

  // Ready
  debug.info('NAP is ready to use, enjoy! [^._.^]ﾉ彡')
}

module.exports = {
  start,
}
