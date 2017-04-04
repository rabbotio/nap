const { loadSeed, writeSeed, genArray, casual } = require('../helpers');

const sequential = require('promise-sequential');

module.exports = function generate() {
  const clogs = loadSeed('clog');
  return sequential(genArray(clogs, clogs.length - 1).map(clog => () => ({
    _id: casual.objectId,
    clogId: clog._id,
    category: clog.category,
  })))
  .then(result => writeSeed('trending', result));
}
