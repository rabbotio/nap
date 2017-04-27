require('dotenv/config')
const nap = require('./server');

global.nap = nap;

nap.start();
