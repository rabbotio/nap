const init = (app, nextjs) => {
  // Custom routes
  try {
    require('../routes')(app, nextjs)
  } catch(e) {
    // Never mind.
  }

  // Next
  const handle = nextjs.getRequestHandler()
  app.get('*', (req, res) => handle(req, res))

  // Server
  const HTTP_PORT = process.env.HTTP_PORT || 3000
  app.listen(HTTP_PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${HTTP_PORT}`)
  })
}

module.exports = init
