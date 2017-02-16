const fs = require( 'fs')
const path = require( 'path')

const expressPort = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo/graphql'
const examplesPath = './graphql'

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function resolveExamplePath(...args) {
  return path.resolve(examplesPath, ...args)
}

function getExampleNames() {
  const preferableOrder = ['user', 'userForRelay', 'northwind']
  const dirs = getDirectories(examplesPath)
  console.info(`schema : ${dirs}`)
  const result = []
  preferableOrder.forEach(name => {
    const idx = dirs.indexOf(name)
    if (idx !== -1) {
      result.push(name)
      dirs.splice(idx, 1)
    }
  })
  dirs.forEach(name => {
    result.push(name)
  })

  console.info(`schema : ${result}`)
  return result
}

module.exports = { expressPort, mongoUri, examplesPath, getDirectories, resolveExamplePath, getExampleNames }