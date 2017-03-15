// TODO : This will need refactoring
const NAPSession = () => { }

NAPSession.willGetSessionToken = () => new Promise(resolve => {
  try {
    // Browser
    resolve(localStorage && localStorage.getItem('sessionToken'))
  } catch (err) {
    // Server, we don't provide sessionToken for SSR
    resolve(null)
  }
})

NAPSession.willSetSessionToken = value => new Promise(resolve => {
  try {
    //console.log('willSetSessionToken:',value)
    // Browser
    localStorage && localStorage.setItem('sessionToken', value)
  } catch (err) {
    // Server, this shouldn' be call
    // NAPSession.nap.sessionToken = value
    throw `This shouldn't be call`
  }
  resolve(true)
})

NAPSession.willClearSessionToken = () => new Promise(resolve => {
  try {
    // Browser
    localStorage && localStorage.removeItem('sessionToken')
  } catch (err) {
    // Server, this shouldn' be call
    // NAPSession.nap.sessionToken = null
    throw `This shouldn't be call`
  }
  resolve(true)
})

module.exports = NAPSession