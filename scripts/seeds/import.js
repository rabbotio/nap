require('dotenv/config');
const _ = require('lodash');
const mongoose = require('mongoose');

const { modelMapping } = require('./models');
const { loadSeed } = require('./helpers');

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
      let result;
      try {
        result = loadSeed(type);
      } catch (error) {
        console.error(error.message);
        return;
      }
      if (!modelMapping[type]) {
        throw new Error(`model ${type} not exists`);
      }
      console.log(`creating ${type}`);
      // FOR ADD isSeed
      modelMapping[type].schema.add({
        isSeed: Boolean,
      });
      await sequential(result.map(obj => () => modelMapping[type].findOneAndUpdate({ _id: obj._id }, Object.assign(
        obj,
        { isSeed: true }
      ), {
        upsert: true,
      })));
    }))
    .then(() => console.log('complete'))
    .catch(error => console.error(error.message))
    .then(() => process.exit(0));
  });

prog.parse(process.argv);
