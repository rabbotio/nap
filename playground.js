const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/graphql');

const models = require('./graphql/clogii/models').models;

models.User.find().then(u => {
  console.log(u);
})
