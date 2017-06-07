const nap = require('./nap')

const init = (req, res, next) => {
  // Inject nap to req
  req.nap = new nap()

  // Good to go
  next()
}

module.exports = init
