/* eslint-env jest */

const _passport_email = require('../passport-email');
const passport_email = jest.genMockFromModule('../passport-email');

passport_email.init = _passport_email.init
passport_email.willSendVerificationEmail = () => 'MOCK_VERIFICATION_URL'

module.exports = passport_email