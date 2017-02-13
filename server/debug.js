// Type
const LOG = '#'
const INFO = '$'
const DEBUG = '@'
const WARN = '!'
const ERROR = '*'

const _print = (type, any) => {
  // No console in prod
  if (process.env.NODE_ENV === 'production') return global.debug

  // Can be crash somehow eg. circular object JSON
  try {
    const text = (any.constructor === String) ? any : JSON.stringify(any)
    const at = new Date()

    console.log([ // eslint-disable-line
      at.toISOString(),
      type,
      text
    ].join(' | '))
  } catch (err) {
    console.error() // eslint-disable-line
  }

  return global.debug
}

class debug extends console.Console { // eslint-disable-line
  constructor() {
    super();
  }

  static log(any) {
    return _print(LOG, any)
  }

  static info(any) {
    return _print(INFO, any)
  }

  static warn(any) {
    return _print(WARN, any)
  }

  static error(any) {
    return _print(ERROR, any)
  }

  static debug(any) {
    return _print(DEBUG, any)
  }
}

global.debug = debug