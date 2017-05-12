const init = ({ port }, app, nextjs) => new Promise((resolve, reject) => {
  // Custom routes
  try {
    require('../routes')(app, nextjs)
  } catch (err) {
    // Never mind.
    debug.info('No custom routes found')
  }

  const handler = nextjs.getRequestHandler()

  app.get('/auth/reset/*', (req, res) => {
    const { parse } = require('url')
    const pathMatch = require('path-match')

    const route = pathMatch()
    const match = route('/auth/reset/:token')
    const { pathname, query } = parse(req.url, true)
    const params = match(pathname)

    if (params === false) {
      handler(req, res)
      return
    }

    nextjs.render(req, res, '/auth/reset', Object.assign(params, query))
  })

  // Default catch-all handler to allow Next.js to handle all other routes
  app.all('*', (req, res) => handler(req, res))

  // Server
  app.listen(port, (err) => {
    if (err) return reject(err)

    debug.info(`NextJS  : http://localhost:${port}`)
    resolve(app)
  })
})

module.exports = init
