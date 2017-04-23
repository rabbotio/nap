const init = ({ port }, app, nextjs) => new Promise((resolve, reject) => {
  // Custom routes
  try {
    require('../routes')(app, nextjs)
  } catch (err) {
    // Never mind.
    debug.warn(err)
  }

  // Default catch-all handler to allow Next.js to handle all other routes
  const handler = nextjs.getRequestHandler()
  app.all('*', (req, res) => handler(req, res))

  // Server
  app.listen(port, (err) => {
    if (err) return reject(err)
    
    debug.info(`NextJS  : http://localhost:${port}`)
    resolve(app)
  })
})

module.exports = init
