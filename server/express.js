const init = (app, nextjs) => {
  // Custom routes
  try {
    require('../routes')(app, nextjs)
  } catch (err) {
    // Never mind.
    debug.warn(err)
  }

  // Default catch-all handler to allow Next.js to handle all other routes
  const handle = nextjs.getRequestHandler()
  app.all('*', (req, res) => handle(req, res))

  // Server
  const HTTP_PORT = process.env.HTTP_PORT || 3000
  app.listen(HTTP_PORT, (err) => {
    if (err) throw err
    debug.log(`> Ready on http://localhost:${HTTP_PORT}`)
  })
}

module.exports = init
