const result = {}
let startGet = false

const getModel = (name) => result[name] ? result[name] : require(`./${name}`)()

module.exports = () => Object.assign(
   getModel('User'),
   getModel('Installation'),
   getModel('Authen'),
   getModel('Error')
)

module.exports.extendModel = (name, schema) => {
  if (result[name]) {
    throw new Error(`duplicate extendModel ${name}`)
  }
  if (startGet) {
    throw new Error(`extendModel can't call after start getting model`)
  }
  result[name] = require(`./${name}`)(schema)
  return result[name]
}

module.exports.getModel = getModel