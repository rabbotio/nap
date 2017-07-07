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
  console.info(
    `NAP is ready to use (${process.env.NODE_ENV}), enjoy! [^._.^]ﾉ彡`
  ) // eslint-disable-line
}

module.exports = {
  start
}
