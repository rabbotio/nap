const init = (app, next) => {
  // Custom routes
  app.get('/a', (req, res) => next.render(req, res, '/b', req.query))
  app.get('/b', (req, res) => next.render(req, res, '/a', req.query))
}

module.exports = init