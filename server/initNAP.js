const { willAuthen, willLoginWithFacebook }  = require('./authen')

const init = (req, res, next) => {
  req.nap = req.nap || {
    willAuthen,
    willLoginWithFacebook
  }

  next()
}

module.exports = init