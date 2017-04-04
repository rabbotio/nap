const _ = require('lodash');
const { writeSeed, casual } = require('../helpers');

module.exports = async function generate() {
  const data = _.range(20).map(() => ({
    _id: casual.objectId,
    name: casual.title,
  }));
  return writeSeed('tag', data);
}
