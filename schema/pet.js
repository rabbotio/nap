const mongoose = require('mongoose')

const PetSchema = new mongoose.Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  age: {
    type: Number
  },
  weight: {
    type: Number
  }
})

const Pet = mongoose.model('Pet', PetSchema)

module.exports = Pet
