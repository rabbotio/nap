class NAPClient {
  static get sessionToken() {
    return localStorage.getItem('sessionToken')
  }
  static set sessionToken(value) {
    localStorage.setItem('sessionToken', value)
  }
}

export default NAPClient