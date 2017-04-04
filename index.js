require('dotenv/config')
const nap = require('./server');
global.nap = nap;

require('./graphql/setup');

nap.start();
