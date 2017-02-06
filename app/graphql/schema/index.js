const mongoose = require('mongoose')
const { getSchema } = require('@risingstack/graffiti-mongoose')
const User = require(  './user')
const Pet = require(  './pet')
const config = require('../../config')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.url || 'mongodb://localhost/graphql')

module.exports = getSchema([Pet, User])