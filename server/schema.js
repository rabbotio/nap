// Will use mongoose as default.
const mongoose = require('mongoose')
const { getSchema } = require('@risingstack/graffiti-mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo/graphql')

// Custom schema from models, hooks
const models = require('../models')()
let hooks = null

// Custom hooks
try {
  hooks = require('../hooks')
} catch (err) {
  // Never mind.
  hooks = null
  debug.warn(err)
}

module.exports = hooks ? getSchema(models, { hooks }) : getSchema(models)
