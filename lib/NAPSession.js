const NAPSession = () => {}

NAPSession.getSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    resolve(localStorage && localStorage.getItem('sessionToken'))
  } else {
    resolve(NAPSession.nap.sessionToken)
  }
})

NAPSession.setSessionToken = value => new Promise(resolve => {
  if (process.browser) {
    localStorage && localStorage.setItem('sessionToken', value)
  } else {
    NAPSession.nap.sessionToken = value
  }
  resolve(true)
})

NAPSession.clearSessionToken = () => new Promise(resolve => {
  if (process.browser) {
    localStorage && localStorage.removeItem('sessionToken')
  } else {
    NAPSession.nap.sessionToken = null
  }
  resolve(true)
})

module.exports = NAPSession