
exports.init = function({ app, config, nextjs}) {
   const express = require('express')
   const router = express.Router()
   app.use('/oauth', router)
}
