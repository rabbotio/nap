class NAPClient {
  static get sessionToken() {
    console.info('get sessionToken:')
    return localStorage.getItem('sessionToken')
  }
  static set sessionToken(value) {
    console.info('set sessionToken:', value)
    localStorage.setItem('sessionToken', value)
  }
}

export default NAPClient