/* eslint-env jest */
require('../debug')

describe('debug', () => {
  // stub
  debug.logger = {
    log: any => any,
    info: any => any,
    warn: any => any,
    error: any => any,
    debug: any => any
  }

  const getRegExp = (type, any) => new RegExp(String.raw`${type}\s\|\s\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ\s|\s${any}`)
  const sample = 'foo'

  it('should print log', () => {
    const func = 'log', output = debug[func](sample)
    expect(output).toEqual(expect.stringMatching(getRegExp(func, sample)))
  })

  it('should print info', () => {
    const func = 'info', output = debug[func](sample)
    expect(output).toEqual(expect.stringMatching(getRegExp(func, sample)))
  })

  it('should print warn', () => {
    const func = 'warn', output = debug[func](sample)
    expect(output).toEqual(expect.stringMatching(getRegExp(func, sample)))
  })

  it('should print error', () => {
    const func = 'error', output = debug[func](sample)
    expect(output).toEqual(expect.stringMatching(getRegExp(func, sample)))
  })

  it('should print debug', () => {
    const func = 'debug', output = debug[func](sample)
    expect(output).toEqual(expect.stringMatching(getRegExp(func, sample)))
  })
})
