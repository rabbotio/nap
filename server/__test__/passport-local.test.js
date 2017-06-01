/* eslint-env jest */

describe('passport-local', () => {
  it('should init without error', async () => {
    const init = require('../passport-local')
    const express = require('express')
    const app = express()

    const passport = require('passport')

    expect(init(app, passport)).toBeUndefined()
  })
})
