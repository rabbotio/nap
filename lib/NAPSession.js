const NAPSession = () => {}

NAPSession.willGetSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    // Browser
    resolve(localStorage && localStorage.getItem('sessionToken'))
  } else {
    // Server
    resolve(NAPSession.nap.sessionToken)
  }
})

NAPSession.willSetSessionToken = value => new Promise(resolve => {
  if (process.browser) {
    // Browser
    localStorage && localStorage.setItem('sessionToken', value)
  } else {
    // Server
    NAPSession.nap.sessionToken = value
  }
  resolve(true)
})

NAPSession.willClearSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    // Browser
    localStorage && localStorage.removeItem('sessionToken')
  } else {
    // Server
    NAPSession.nap.sessionToken = null
  }
  resolve(true)
})

module.exports = NAPSession