require('dotenv/config');
const _ = require('lodash');
const mongoose = require('mongoose');

const { modelMapping } = require('./models');

mongoose.Promise = Promise;

mongoose.connect(process.env.DATABASE_URI_FOR_SEED);

const prog = require('caporal');
const sequential = require('promise-sequential');

const defaultTypes = _.keys(modelMapping).join(',');

prog
  .version('1.0.0')
  .option('--types <types>', prog.LIST)
  .action((args, options) => {
    const types = (options.types || defaultTypes).split(',');
    return sequential(types.map(type => async () => {
      if (!modelMapping[type]) {
        throw new Error(`model ${type} not exists`);
      }
      console.log(`removing ${type}`);
      await modelMapping[type].remove({
        isSeed: true,
      });
    }))
    .then(() => console.log('complete'))
    .catch(error => console.error(error.message))
    .then(() => process.exit(0));
  });

prog.parse(process.argv);
