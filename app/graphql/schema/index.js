const mongoose = require('mongoose')
const { getSchema } = require('@risingstack/graffiti-mongoose')
const User = require(  './user')
const Pet = require(  './pet')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/graphql')

module.exports = getSchema([Pet, User])