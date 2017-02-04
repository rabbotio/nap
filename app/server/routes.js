const init = (app, next) => {
  // Custom routes
  app.get('/a', (req, res) => {
    return next.render(req, res, '/b', req.query)
  })

  app.get('/b', (req, res) => {
    return next.render(req, res, '/a', req.query)
  })

  // Next
  const handle = next.getRequestHandler()
  app.get('*', (req, res) => handle(req, res))

  // Server
  const HTTP_PORT = process.env.HTTP_PORT || 3000
  app.listen(HTTP_PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${HTTP_PORT}`)
  })
}

module.exports = init
