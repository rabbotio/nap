// Will use mongoose as default.
const mongoose = require("mongoose")
const { getSchema } = require("@risingstack/graffiti-mongoose")

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo/graphql")

// Custom schema from models, hooks
const models = require("../models")()
const hooks = require("./hooks")
module.exports = getSchema(models, { hooks })
