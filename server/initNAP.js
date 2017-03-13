const { willAuthen, willLoginWithFacebook }  = require('./authen')

const init = (req, res, next) => {
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook
  }

  req.nap.errors = []

  next()
}

module.exports = init