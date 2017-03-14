class NAPClient {
  static get sessionToken() {
    return process.browser && localStorage.getItem('sessionToken')
  }
  
  static set sessionToken(value) {
    process.browser && localStorage.setItem('sessionToken', value)
  }
}

export default NAPClient