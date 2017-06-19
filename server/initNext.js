const init = ({ next_disabled, dev }) => new Promise(resolve => {
  // Disabled?
  if (next_disabled) return resolve(null)

  // Create NextJS
  const nextjs = require('next')({ dev })

  // Preparing...
  nextjs.prepare().then(() => resolve(nextjs))
})

module.exports = init
