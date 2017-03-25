// Type
const LOG = 'log', INFO = 'info', DEBUG = 'debug', WARN = 'warn', ERROR = 'error'

let _console = console
const _print = (type, any) => {
  // No console in prod
  if (process.env.NODE_ENV === 'production') return

  try {
    return _console[type].apply(null, [`${type} | ${new Date().toISOString()} |`, ...any])
  } catch (err) {
    console.error(err) // eslint-disable-line
    return
  }
}

global.debug = class debug {
  static set logger(value) {
    _console = value
  }

  static log(...any) {
    return _print(LOG, any)
  }

  static info(...any) {
    return _print(INFO, any)
  }

  static warn(...any) {
    return _print(WARN, any)
  }

  static error(...any) {
    return _print(ERROR, any)
  }

  static debug(...any) {
    return _print(DEBUG, any)
  }
}
