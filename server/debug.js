// Type
const LOG = 'log'
const INFO = 'info'
const DEBUG = 'debug'
const WARN = 'warn'
const ERROR = 'error'

const debug = class debug extends console.Console { // eslint-disable-line
  static _print(...args) {
    // No console in prod
    if (process.env.NODE_ENV === 'production') return global.debug

    try {
      console[args[0]]([ // eslint-disable-line
        args[0],
        new Date().toISOString(),
        String(args[1])
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