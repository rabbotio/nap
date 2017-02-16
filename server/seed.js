// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

const { MongoClient } = require('mongodb')
const fs = require('fs')
const { getExampleNames, resolveExamplePath, mongoUri } = require('../graphql')

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  const exampleNames = getExampleNames();
  for (let name of exampleNames) {
    debug.log(`Starting seed '${name}'...`);
    const seedFile = resolveExamplePath(name, 'data/seed.js');
    try {
      fs.accessSync(seedFile, fs.F_OK);
      let seedFn = require(seedFile).default;
      await seedFn(db);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        debug.log(`  file '${seedFile}' not found. Skipping...`);
      } else {
        debug.log(e);
      }
    }
  }

  debug.log('Seed competed!');
  db.close();
}

run().catch(e => {
  debug.log(e);
  process.exit(0);
});
