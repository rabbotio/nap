class persist {
  static get SESSION_TOKEN_KEY () { return 'sessionToken' }
  static willGetSessionToken() {
    return new Promise(resolve => {
      try {
        resolve(localStorage && localStorage.getItem(persist.SESSION_TOKEN_KEY))
      } catch (err) {
        resolve(null)
      }
    })
  }

  static willSetSessionToken(sessionToken) {
    return new Promise(resolve => {
      try {
        localStorage && localStorage.setItem(persist.SESSION_TOKEN_KEY, sessionToken)
      } catch (err) {
        // Ignore
      }
      resolve(sessionToken)
    })
  }

  static willRemoveSessionToken() {
    return new Promise(resolve => {
      try {
        localStorage && localStorage.removeItem(persist.SESSION_TOKEN_KEY)
      } catch (err) {
        // Ignore
      }
      resolve(null)
    })
  }
}

module.exports = persist
