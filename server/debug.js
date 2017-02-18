// Type
const LOG = 'log'
const INFO = 'info'
const DEBUG = 'debug'
const WARN = 'warn'
const ERROR = 'error'

const debug = class debug extends console.Console { // eslint-disable-line
  constructor() {
    super()
  }

  static _toString(any) {
    // Can be crash somehow eg. circular object JSON
    let result = ''
    any.forEach(item => {
      try {
        result += (item.constructor === String) ? item : JSON.stringify(item, null, 2)
      } catch (err) {
        // NVM
      }
    })

    return result
  }

  static _print(...args) {
    // No console in prod
    if (process.env.NODE_ENV === 'production') return global.debug

    try {
      const type = args[0]
      const any = args[1]
      const text = global.debug._toString(any)
      const at = new Date()

      console[type]([ // eslint-disable-line
        type,
        at.toISOString(),
        text
      ].join(' | '))
    } catch (err) {
      console.error(err) // eslint-disable-line
    }

    return global.debug
  }

  static log(...any) {
    return global.debug._print(LOG, any)
  }

  static info(...any) {
    return global.debug._print(INFO, any)
  }

  static warn(...any) {
    return global.debug._print(WARN, any)
  }

  static error(...any) {
    return global.debug._print(ERROR, any)
  }

  static debug(...any) {
    return global.debug._print(DEBUG, any)
  }
}

global.debug = debug