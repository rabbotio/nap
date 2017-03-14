// TODO : This will need refactoring
const NAPSession = () => {}

NAPSession.willGetSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    // Browser
    resolve(localStorage && localStorage.getItem('sessionToken'))
  } else {
    // Server, we don't provide sessionToken for SSR
    resolve(null)
  }
})

NAPSession.willSetSessionToken = value => new Promise(resolve => {
  if (process.browser) {
    // Browser
    localStorage && localStorage.setItem('sessionToken', value)
  } else {
    // Server, this shouldn' be call
    // NAPSession.nap.sessionToken = value
    throw `This shouldn't be call`
  }
  resolve(true)
})

NAPSession.willClearSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    // Browser
    localStorage && localStorage.removeItem('sessionToken')
  } else {
    // Server, this shouldn' be call
    // NAPSession.nap.sessionToken = null
    throw `This shouldn't be call`
  }
  resolve(true)
})

module.exports = NAPSession