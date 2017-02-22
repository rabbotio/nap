const init = (app, nextjs) => {
  // Custom routes
  app.get('/a', (req, res) => nextjs.render(req, res, '/b', req.query))
  app.get('/b', (req, res) => nextjs.render(req, res, '/a', req.query))

  app.get('/user', async (req, res) => {
    const user = await (async () => NAP.User.findOne({ name: 'pignoom' }).exec(user => user))()
    debug.log(user)
    debug.log('render')

    nextjs.render(req, res, '/b', req.query)
  })
}

module.exports = init