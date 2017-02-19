const init = (app) => {

  // Generate a v1 UUID (time-based)
  const uuidV1 = require('uuid/v1');

  const loadUser = (req, res, next) => {
    req.session.user && req.session.user.id && debug.log('user.id : ', req.session.user.id)
    req.session.user = req.session.user || { id: uuidV1 }
    req.user = req.user || req.session.user
    next()
  }

  return app.use(loadUser)
}

module.exports = init