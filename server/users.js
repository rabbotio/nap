const init = (app) => {

  const uuid = require('uuid/v4')

  const loadUser = (req, res, next) => {
    req.session.user && req.session.user.id && debug.log('user.id : ', req.session.user.id)
    req.session.user = req.session.user || { id: uuid }
    req.user = req.user || req.session.user
    next()
  }

  return app.use(loadUser)
}

module.exports = init