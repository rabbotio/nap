const init = (app, nextjs) => {
  // Custom routes
  app.get('/a', (req, res) => nextjs.render(req, res, '/b', req.query))
  app.get('/b', (req, res) => nextjs.render(req, res, '/a', req.query))
}

module.exports = init